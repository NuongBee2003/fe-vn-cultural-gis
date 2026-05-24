import { useStudio } from "./useStudio";
import StudioPreview from "@/components/user/studio/StudioPreview";
import StudioControls from "@/components/user/studio/StudioControls";

export default function StudioPage() {
  const studio = useStudio();

  return (
    <div className="flex-1 h-full flex overflow-hidden bg-stone-50">
      <StudioPreview
        photoUrl={studio.photoUrl}
        selectedStyle={studio.selectedStyle}
        caption={studio.caption}
        isGenerating={studio.isGenerating}
        isGenerated={studio.isGenerated}
        error={studio.error}
      />
      <StudioControls
        selectedStyle={studio.selectedStyle}
        setSelectedStyle={studio.setSelectedStyle}
        customPrompt={studio.customPrompt}
        setCustomPrompt={studio.setCustomPrompt}
        buildFinalPrompt={studio.buildFinalPrompt}
        caption={studio.caption}
        setCaption={studio.setCaption}
        isGenerating={studio.isGenerating}
        isGenerated={studio.isGenerated}
        isDownloading={studio.isDownloading}
        handleGenerate={studio.handleGenerate}
        handleDownload={studio.handleDownload}
      />
    </div>
  );
}
