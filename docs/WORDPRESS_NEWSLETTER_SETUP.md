# WordPress Newsletter Implementácia

## 📋 Prehľad

Pre fungovanie newsletter formulára potrebujeme vo WordPress:

1. Custom Post Type pre ukladanie emailov
2. REST API endpoint
3. Autentifikáciu pre Next.js aplikáciu

## 🛠️ Krok 1: Vytvorenie Custom Post Type

Pridajte tento kód do `functions.php` vašej WordPress témy alebo vytvorte vlastný plugin:

```php
// Register Newsletter Emails Custom Post Type
function register_newsletter_emails_post_type() {
    $labels = array(
        'name'                  => 'Newsletter Emails',
        'singular_name'         => 'Email',
        'menu_name'             => 'Newsletter',
        'name_admin_bar'        => 'Newsletter Email',
        'add_new'               => 'Pridať nový',
        'add_new_item'          => 'Pridať nový email',
        'new_item'              => 'Nový email',
        'edit_item'             => 'Upraviť email',
        'view_item'             => 'Zobraziť email',
        'all_items'             => 'Všetky emaily',
        'search_items'          => 'Hľadať emaily',
        'not_found'             => 'Žiadne emaily nenájdené',
        'not_found_in_trash'    => 'Žiadne emaily v koši',
    );

    $args = array(
        'labels'             => $labels,
        'public'             => false,
        'publicly_queryable' => false,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => false,
        'rewrite'            => false,
        'capability_type'    => 'post',
        'has_archive'        => false,
        'hierarchical'       => false,
        'menu_position'      => 30,
        'menu_icon'          => 'dashicons-email',
        'supports'           => array('title'),
        'show_in_rest'       => true,
        'rest_base'          => 'emails',
    );

    register_post_type('newsletter_email', $args);
}
add_action('init', 'register_newsletter_emails_post_type');

// Register meta fields for REST API
function register_newsletter_meta_fields() {
    register_post_meta('newsletter_email', 'email', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));

    register_post_meta('newsletter_email', 'privacy_accepted', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'boolean',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));

    register_post_meta('newsletter_email', 'signup_date', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));
}
add_action('init', 'register_newsletter_meta_fields');
```

## 🔐 Krok 2: Vytvorenie Application Password

1. Prihláste sa do WordPress admin
2. Choďte na **Používatelia → Váš profil**
3. Scrollujte dole na sekciu **Application Passwords**
4. Zadajte názov aplikácie (napr. "Next.js Newsletter")
5. Kliknite na **Add New Application Password**
6. **Skopírujte vygenerované heslo** (zobrazí sa len raz!)

## 🔧 Krok 3: Konfigurácia Next.js

Pridajte do `.env.local`:

```env
WORDPRESS_API_URL=https://vasa-domena.sk/wp-json
WORDPRESS_AUTH_TOKEN=username:application_password
```

**Poznámka**: `WORDPRESS_AUTH_TOKEN` je v formáte `username:password` zakódovaný v Base64.

Vytvorte helper funkciu pre generovanie tokenu:

```javascript
// Príklad generovania auth tokenu
const username = 'vas_username';
const appPassword = 'xxxx xxxx xxxx xxxx xxxx xxxx'; // bez medzier
const token = Buffer.from(`${username}:${appPassword}`).toString('base64');
console.log('WORDPRESS_AUTH_TOKEN=' + token);
```

## 📊 Krok 4: Pridanie admin stĺpcov

Pre lepší prehľad v admin rozhraní pridajte tento kód:

```php
// Add custom columns to newsletter emails list
function add_newsletter_columns($columns) {
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['email'] = 'Email';
    $new_columns['privacy_accepted'] = 'Súhlas';
    $new_columns['signup_date'] = 'Dátum prihlásenia';
    return $new_columns;
}
add_filter('manage_newsletter_email_posts_columns', 'add_newsletter_columns');

// Populate custom columns
function populate_newsletter_columns($column, $post_id) {
    switch ($column) {
        case 'email':
            echo get_post_meta($post_id, 'email', true);
            break;
        case 'privacy_accepted':
            $accepted = get_post_meta($post_id, 'privacy_accepted', true);
            echo $accepted ? '✓' : '✗';
            break;
        case 'signup_date':
            $date = get_post_meta($post_id, 'signup_date', true);
            if ($date) {
                echo date('d.m.Y H:i', strtotime($date));
            }
            break;
    }
}
add_action('manage_newsletter_email_posts_custom_column', 'populate_newsletter_columns', 10, 2);

// Make email column sortable
function make_newsletter_columns_sortable($columns) {
    $columns['email'] = 'email';
    $columns['signup_date'] = 'signup_date';
    return $columns;
}
add_filter('manage_edit-newsletter_email_sortable_columns', 'make_newsletter_columns_sortable');
```

## 📧 Krok 5: Export emailov

Pridajte funkciu pre export do CSV:

```php
// Add export button to admin
function add_newsletter_export_button() {
    $screen = get_current_screen();
    if ($screen->post_type === 'newsletter_email') {
        ?>
        <script type="text/javascript">
            jQuery(document).ready(function($) {
                $('.wrap h1').append('<a href="<?php echo admin_url('admin-ajax.php?action=export_newsletter_emails'); ?>" class="page-title-action">Export CSV</a>');
            });
        </script>
        <?php
    }
}
add_action('admin_head', 'add_newsletter_export_button');

// Handle export
function export_newsletter_emails() {
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized');
    }

    $args = array(
        'post_type' => 'newsletter_email',
        'posts_per_page' => -1,
        'post_status' => 'publish'
    );

    $emails = get_posts($args);

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=newsletter-emails-' . date('Y-m-d') . '.csv');

    $output = fopen('php://output', 'w');
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF)); // UTF-8 BOM

    fputcsv($output, array('Email', 'Súhlas', 'Dátum prihlásenia'));

    foreach ($emails as $email) {
        $email_address = get_post_meta($email->ID, 'email', true);
        $privacy = get_post_meta($email->ID, 'privacy_accepted', true) ? 'Áno' : 'Nie';
        $date = get_post_meta($email->ID, 'signup_date', true);

        fputcsv($output, array($email_address, $privacy, $date));
    }

    fclose($output);
    exit;
}
add_action('wp_ajax_export_newsletter_emails', 'export_newsletter_emails');
```

## 🚀 Krok 6: Integrácia s email službami

### Mailchimp integrácia:

```php
function sync_to_mailchimp($post_id, $post, $update) {
    if ($post->post_type !== 'newsletter_email' || $update) {
        return;
    }

    $email = get_post_meta($post_id, 'email', true);
    $api_key = 'YOUR_MAILCHIMP_API_KEY';
    $list_id = 'YOUR_LIST_ID';

    $data = array(
        'email_address' => $email,
        'status' => 'subscribed',
        'merge_fields' => array(
            'SIGNUP' => date('Y-m-d')
        )
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://us1.api.mailchimp.com/3.0/lists/$list_id/members/");
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Authorization: apikey ' . $api_key,
        'Content-Type: application/json'
    ));
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);
}
add_action('save_post', 'sync_to_mailchimp', 10, 3);
```

## 🔒 Krok 7: Bezpečnosť

1. **Rate limiting** - obmedzenie počtu registrácií:

```php
function check_newsletter_rate_limit($email) {
    $transient_key = 'newsletter_' . md5($email);
    if (get_transient($transient_key)) {
        return false; // Already signed up recently
    }
    set_transient($transient_key, true, HOUR_IN_SECONDS);
    return true;
}
```

2. **Validácia emailu**:

```php
function validate_newsletter_email($email) {
    // Check if email already exists
    $existing = get_posts(array(
        'post_type' => 'newsletter_email',
        'meta_key' => 'email',
        'meta_value' => $email,
        'posts_per_page' => 1
    ));

    return empty($existing);
}
```

## 📝 Krok 8: Testovanie

1. **Test REST API**:

```bash
curl -X GET https://vasa-domena.sk/wp-json/wp/v2/emails \
  -H "Authorization: Basic YOUR_BASE64_TOKEN"
```

2. **Test POST**:

```bash
curl -X POST https://vasa-domena.sk/wp-json/wp/v2/emails \
  -H "Authorization: Basic YOUR_BASE64_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "test@example.com",
    "status": "publish",
    "meta": {
      "email": "test@example.com",
      "privacy_accepted": true,
      "signup_date": "2024-01-01T12:00:00Z"
    }
  }'
```

## ✅ Záver

Po implementácii týchto krokov budete mať:

- Funkčný newsletter systém
- Admin rozhranie pre správu emailov
- Export do CSV
- Možnosť integrácie s email službami
- Bezpečné API pre Next.js aplikáciu

**Tip**: Pre produkciu odporúčam použiť špecializované služby ako Mailchimp, SendGrid alebo ConvertKit namiesto ukladania emailov priamo vo WordPress.
