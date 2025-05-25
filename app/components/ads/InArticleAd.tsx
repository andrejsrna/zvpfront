import AdUnit from './AdUnit';

interface InArticleAdProps {
  slot: string;
}

export default function InArticleAd({ slot }: InArticleAdProps) {
  return (
    <div className="my-8 mx-auto max-w-2xl">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-xs text-gray-500 text-center mb-2">Reklama</p>
        <AdUnit
          slot={slot}
          format="fluid"
          className="min-h-[250px]"
          style={{
            textAlign: 'center',
          }}
        />
      </div>
    </div>
  );
}
