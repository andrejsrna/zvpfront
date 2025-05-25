import AdUnit from './AdUnit';

interface NativeAdProps {
  slot: string;
}

export default function NativeAd({ slot }: NativeAdProps) {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
        Sponzorovaný obsah
      </div>
      <AdUnit
        slot={slot}
        format="fluid"
        className="native-ad"
        style={{
          minHeight: '120px',
        }}
      />
    </div>
  );
}
