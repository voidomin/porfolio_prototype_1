"use client";

import { useState, useEffect } from "react";
import { 
  Camera, 
  MapPin, 
  Sliders, 
  Compass, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  Image as ImageIcon, 
  AlertCircle, 
  FileText
} from "lucide-react";
import Link from "next/link";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ExifData {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  location?: string;
}

interface PendingFile {
  name: string;
}

interface PendingQueueProps {
  readonly isLoadingFiles: boolean;
  readonly pendingFiles: readonly string[];
  readonly selectedFile: string | null;
  readonly handleSelectFile: (filename: string) => void;
  readonly fetchPendingFiles: () => void;
}

function PendingQueue({
  isLoadingFiles,
  pendingFiles,
  selectedFile,
  handleSelectFile,
  fetchPendingFiles,
}: Readonly<PendingQueueProps>) {
  if (isLoadingFiles) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-stone-500">
        <Loader2 className="w-8 h-8 animate-spin text-dawn-500 mb-2" />
        <span className="text-xs">Scanning directory...</span>
      </div>
    );
  }
  if (pendingFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-stone-800 rounded-xl px-4">
        <ImageIcon className="w-10 h-10 text-stone-700 mb-3" />
        <span className="text-sm font-semibold text-stone-400">No pending photos found</span>
        <span className="text-[11px] text-stone-600 mt-2">
          Drop files in `/images-to-process/` and they will show up here.
        </span>
        <button 
          type="button"
          onClick={fetchPendingFiles} 
          className="mt-4 px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs text-stone-300 hover:bg-stone-750 transition cursor-pointer"
        >
          Refresh Scan
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
      {pendingFiles.map((file) => {
        const isSelected = selectedFile === file;
        return (
          <button
            key={file}
            type="button"
            onClick={() => handleSelectFile(file)}
            className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition ${
              isSelected 
                ? "bg-dawn-950/20 border-dawn-700 text-white shadow-lg" 
                : "bg-stone-950/40 border-stone-850 text-stone-400 hover:bg-stone-900/60 hover:text-stone-200"
            }`}
          >
            <ImageIcon className={`w-5 h-5 shrink-0 ${isSelected ? "text-dawn-400" : "text-stone-600"}`} />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate">{file}</p>
              <p className="text-[10px] text-stone-600 font-mono mt-0.5">Ready for processing</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function EmptyWorkspaceState() {
  return (
    <div className="bg-stone-900/60 backdrop-blur-md rounded-2xl border border-stone-850 p-6 md:p-8 flex flex-col items-center justify-center py-32 text-center text-stone-500">
      <Sliders className="w-12 h-12 text-stone-700 mb-4 animate-pulse" />
      <h3 className="text-base font-bold text-stone-400">No Image Selected</h3>
      <p className="text-xs text-stone-600 max-w-sm mt-2">
        Select a pending image from the sidebar to automatically extract its camera EXIF settings and prepare it for import.
      </p>
    </div>
  );
}

interface AdjustmentsSectionProps {
  readonly brightness: number;
  readonly setBrightness: (val: number) => void;
  readonly contrast: number;
  readonly setContrast: (val: number) => void;
  readonly saturation: number;
  readonly setSaturation: (val: number) => void;
  readonly rotation: number;
  readonly setRotation: (val: number) => void;
}

function AdjustmentsSection({
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation,
  rotation,
  setRotation,
}: Readonly<AdjustmentsSectionProps>) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wider text-dawn-500 font-bold mb-4 flex items-center gap-1.5">
        <Sliders className="w-4 h-4" />
        Luminance & Color Adjustments
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Brightness */}
        <div>
          <div className="flex justify-between text-[10px] font-mono text-stone-400 mb-1.5">
            <span>BRIGHTNESS</span>
            <span>{brightness.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={brightness}
            onChange={(e) => setBrightness(Number.parseFloat(e.target.value))}
            className="w-full accent-dawn-500 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        {/* Contrast */}
        <div>
          <div className="flex justify-between text-[10px] font-mono text-stone-400 mb-1.5">
            <span>CONTRAST</span>
            <span>{contrast.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={contrast}
            onChange={(e) => setContrast(Number.parseFloat(e.target.value))}
            className="w-full accent-dawn-500 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        {/* Saturation */}
        <div>
          <div className="flex justify-between text-[10px] font-mono text-stone-400 mb-1.5">
            <span>SATURATION</span>
            <span>{saturation.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={saturation}
            onChange={(e) => setSaturation(Number.parseFloat(e.target.value))}
            className="w-full accent-dawn-500 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-stone-800 flex justify-between items-center">
        <span className="text-[10px] text-stone-500 font-mono">ROTATION</span>
        <div className="flex gap-2">
          {[0, 90, 180, 270].map((angle) => (
            <button
              key={angle}
              type="button"
              onClick={() => setRotation(angle)}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-mono border transition ${
                rotation === angle
                  ? "bg-dawn-600 text-stone-950 border-dawn-600 font-bold"
                  : "bg-stone-950 border-stone-800 text-stone-400 hover:text-white"
              }`}
            >
              {angle}°
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ExifMetadataSectionProps {
  readonly exif: ExifData;
  readonly onChange: (updatedExif: ExifData) => void;
}

function ExifMetadataSection({
  exif,
  onChange,
}: Readonly<ExifMetadataSectionProps>) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wider text-dawn-500 font-bold mb-4 flex items-center gap-1.5">
        <Camera className="w-4 h-4" />
        Camera Exposure Settings (EXIF)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="exif-camera" className="block text-[10px] text-stone-500 font-bold mb-1.5 uppercase font-mono">
            Camera Body
          </label>
          <input
            id="exif-camera"
            type="text"
            value={exif.camera || ""}
            onChange={(e) => onChange({ ...exif, camera: e.target.value })}
            className="w-full bg-stone-950 border border-stone-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-dawn-500 transition"
            placeholder="Sony Alpha 7R V"
          />
        </div>
        <div>
          <label htmlFor="exif-lens" className="block text-[10px] text-stone-500 font-bold mb-1.5 uppercase font-mono">
            Optics / Lens
          </label>
          <input
            id="exif-lens"
            type="text"
            value={exif.lens || ""}
            onChange={(e) => onChange({ ...exif, lens: e.target.value })}
            className="w-full bg-stone-950 border border-stone-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-dawn-500 transition"
            placeholder="FE 24-70mm F2.8 GM II"
          />
        </div>
        <div>
          <label htmlFor="exif-focalLength" className="block text-[10px] text-stone-500 font-bold mb-1.5 uppercase font-mono">
            Focal Length
          </label>
          <input
            id="exif-focalLength"
            type="text"
            value={exif.focalLength || ""}
            onChange={(e) => onChange({ ...exif, focalLength: e.target.value })}
            className="w-full bg-stone-950 border border-stone-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-dawn-500 transition"
            placeholder="e.g. 35mm"
          />
        </div>
        <div>
          <label htmlFor="exif-aperture" className="block text-[10px] text-stone-500 font-bold mb-1.5 uppercase font-mono">
            Aperture
          </label>
          <input
            id="exif-aperture"
            type="text"
            value={exif.aperture || ""}
            onChange={(e) => onChange({ ...exif, aperture: e.target.value })}
            className="w-full bg-stone-950 border border-stone-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-dawn-500 transition"
            placeholder="e.g. f/8.0"
          />
        </div>
        <div>
          <label htmlFor="exif-shutterSpeed" className="block text-[10px] text-stone-500 font-bold mb-1.5 uppercase font-mono">
            Shutter Speed
          </label>
          <input
            id="exif-shutterSpeed"
            type="text"
            value={exif.shutterSpeed || ""}
            onChange={(e) => onChange({ ...exif, shutterSpeed: e.target.value })}
            className="w-full bg-stone-950 border border-stone-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-dawn-500 transition"
            placeholder="e.g. 1/125s"
          />
        </div>
        <div>
          <label htmlFor="exif-iso" className="block text-[10px] text-stone-500 font-bold mb-1.5 uppercase font-mono">
            ISO Speed
          </label>
          <input
            id="exif-iso"
            type="text"
            value={exif.iso || ""}
            onChange={(e) => onChange({ ...exif, iso: e.target.value })}
            className="w-full bg-stone-950 border border-stone-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-dawn-500 transition"
            placeholder="e.g. 100"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="exif-location" className="block text-[10px] text-stone-500 font-bold mb-1.5 uppercase font-mono flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-stone-600" />
          Geographical Location
        </label>
        <input
          id="exif-location"
          type="text"
          value={exif.location || ""}
          onChange={(e) => onChange({ ...exif, location: e.target.value })}
          className="w-full bg-stone-950 border border-stone-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-dawn-500 transition"
          placeholder="e.g. Kashmir Great Lakes, India"
        />
      </div>
    </div>
  );
}

type WatermarkPosition = "southeast" | "southwest" | "northeast" | "northwest";

interface WatermarkSectionProps {
  readonly enabled: boolean;
  readonly setEnabled: (val: boolean) => void;
  readonly text: string;
  readonly setText: (val: string) => void;
  readonly position: WatermarkPosition;
  readonly setPosition: (val: WatermarkPosition) => void;
}

interface StudioHeaderProps {
  readonly selectedFile: string | null;
  readonly isSidebarOpen: boolean;
  readonly setIsSidebarOpen: (open: boolean) => void;
}

function StudioHeader({ selectedFile, isSidebarOpen, setIsSidebarOpen }: Readonly<StudioHeaderProps>) {
  return (
    <header className="flex justify-between items-center border-b border-stone-800 pb-6 mb-10">
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="p-2.5 rounded-xl bg-stone-900 border border-stone-850 hover:bg-stone-800 transition text-stone-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-[10px] text-dawn-500 uppercase tracking-widest font-bold">Studio Dashboard</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Golden Hour Photo Lab</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {selectedFile && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="px-4 py-2 bg-stone-900 border border-stone-850 text-stone-400 hover:text-white rounded-xl transition flex items-center gap-2 text-xs font-semibold hover:border-dawn-500 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-dawn-500" />
            {isSidebarOpen ? "Hide Queue" : "Show Queue"}
          </button>
        )}
        <div className="hidden sm:block text-right">
          <p className="text-xs text-stone-500 font-mono">Location-Mode: LOCAL DEVELOPMENT</p>
        </div>
      </div>
    </header>
  );
}

interface StatusBannerProps {
  readonly statusMessage: { type: "success" | "error"; text: string } | null;
}

function StatusBanner({ statusMessage }: Readonly<StatusBannerProps>) {
  if (!statusMessage) return null;
  return (
    <div className={`p-4 rounded-xl mb-8 flex items-start gap-3 border ${
      statusMessage.type === "success" 
        ? "bg-emerald-950/30 border-emerald-800 text-emerald-300" 
        : "bg-rose-950/30 border-rose-800 text-rose-300"
    }`}>
      {statusMessage.type === "success" ? (
        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      )}
      <div>
        <p className="text-sm font-semibold">{statusMessage.type === "success" ? "Success" : "Error Occurred"}</p>
        <p className="text-xs mt-1 text-stone-300/80">{statusMessage.text}</p>
      </div>
    </div>
  );
}

interface WorkspaceCanvasProps {
  readonly editingPhotoId: string | null;
  readonly selectedFile: string;
  readonly crop: Crop | undefined;
  readonly setCrop: (c: Crop | undefined) => void;
  readonly setCompletedCrop: (c: PixelCrop | null) => void;
  readonly onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  readonly brightness: number;
  readonly setBrightness: (val: number) => void;
  readonly contrast: number;
  readonly setContrast: (val: number) => void;
  readonly saturation: number;
  readonly setSaturation: (val: number) => void;
  readonly rotation: number;
  readonly setRotation: (val: number) => void;
}

function WorkspaceCanvas({
  editingPhotoId,
  selectedFile,
  crop,
  setCrop,
  setCompletedCrop,
  onImageLoad,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation,
  rotation,
  setRotation,
}: Readonly<WorkspaceCanvasProps>) {
  if (editingPhotoId) {
    return (
      <div className="flex flex-col items-center justify-center overflow-hidden">
        <span className="text-[10px] text-stone-500 uppercase tracking-[0.2em] font-bold mb-3 block text-center">
          Exhibition Image Preview (CMS View)
        </span>
        <div className="w-full overflow-auto max-h-[82vh] xl:max-h-[850px] flex items-center justify-center rounded-xl border border-stone-950 bg-stone-900/20 p-2">
          <img 
            src={selectedFile} 
            alt="Published preview" 
            className="w-full max-h-[78vh] xl:max-h-[800px] object-contain rounded-xl shadow-lg border border-stone-950 pointer-events-none"
          />
        </div>
        <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-850 text-center w-full mt-6">
          <p className="text-[10px] text-dawn-500 font-bold uppercase tracking-wider">EDITING PUBLISHED PHOTO</p>
          <p className="text-[10px] text-stone-500 mt-1.5 leading-relaxed">
            Visual processing (cropping, rotation, and color lab sliders) is finalized. 
            To modify the visuals of this image, please delete it from the gallery and re-import the original file from the Queue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top: Interactive Cropper Canvas */}
      <div className="flex flex-col items-center justify-center border-b border-stone-850 pb-5 mb-5 overflow-hidden">
        <span className="text-[10px] text-stone-500 uppercase tracking-[0.2em] font-bold mb-3 block text-center">
          Cropping Laboratory (Free-Crop)
        </span>
        <div className="w-full overflow-auto max-h-[82vh] xl:max-h-[850px] flex items-center justify-center rounded-xl border border-stone-950 bg-stone-900/20 p-2">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            className="w-full flex justify-center"
          >
            <img 
              src={`/api/admin/view?file=${encodeURIComponent(selectedFile)}`} 
              alt="Interactive crop preview" 
              onLoad={onImageLoad}
              className="w-full max-h-[78vh] xl:max-h-[800px] object-contain rounded-xl pointer-events-auto transition-all"
              style={{ 
                filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`,
                transform: `rotate(${rotation}deg)`,
              }}
            />
          </ReactCrop>
        </div>
        <p className="text-[10px] text-stone-500 mt-3 text-center max-w-sm leading-relaxed">
          Drag on image to crop. Leave unselected to import full resolution.
        </p>
      </div>

      {/* Bottom: Live Adjustments Laboratory */}
      <AdjustmentsSection
        brightness={brightness}
        setBrightness={setBrightness}
        contrast={contrast}
        setContrast={setContrast}
        saturation={saturation}
        setSaturation={setSaturation}
        rotation={rotation}
        setRotation={setRotation}
      />
    </>
  );
}

function WatermarkSection({
  enabled,
  setEnabled,
  text,
  setText,
  position,
  setPosition,
}: Readonly<WatermarkSectionProps>) {
  return (
    <div className="bg-stone-950 p-6 rounded-2xl border border-stone-850">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase tracking-wider text-dawn-500 font-bold flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          Signature Watermarking
        </h3>
        <label htmlFor="watermarkEnabled" className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-300 select-none">
          <input
            id="watermarkEnabled"
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-4.5 h-4.5 bg-stone-900 border border-stone-800 rounded text-dawn-600 focus:ring-dawn-500"
          />
          <span>Enable</span>
        </label>
      </div>
      
      {enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label htmlFor="watermarkText" className="block text-[10px] text-stone-500 font-bold mb-1.5 uppercase font-mono">
              Watermark Text
            </label>
            <input
              id="watermarkText"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-stone-950 border border-stone-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-dawn-500 transition"
              placeholder="e.g. © Akash Photography"
            />
          </div>
          <div>
            <label htmlFor="watermarkPosition" className="block text-[10px] text-stone-500 font-bold mb-1.5 uppercase font-mono">
              Position / Gravity
            </label>
            <select
              id="watermarkPosition"
              value={position}
              onChange={(e) => setPosition(e.target.value as any)}
              className="w-full bg-stone-950 border border-stone-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-dawn-500 transition"
            >
              <option value="southeast">Bottom Right (Southeast)</option>
              <option value="southwest">Bottom Left (Southwest)</option>
              <option value="northeast">Top Right (Northeast)</option>
              <option value="northwest">Top Left (Northwest)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

interface PublishedQueueProps {
  readonly photos: readonly any[];
  readonly selectedId: string | null;
  readonly onSelect: (photo: any) => void;
  readonly onRefresh: () => void;
}

function PublishedQueue({
  photos,
  selectedId,
  onSelect,
  onRefresh,
}: Readonly<PublishedQueueProps>) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-stone-800 rounded-xl px-4">
        <ImageIcon className="w-10 h-10 text-stone-700 mb-3" />
        <span className="text-sm font-semibold text-stone-400">No published photos found</span>
        <p className="text-[11px] text-stone-600 mt-2">
          Import photos from the queue tab to view them here.
        </p>
        <button 
          type="button"
          onClick={onRefresh} 
          className="mt-4 px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs text-stone-300 hover:bg-stone-750 transition cursor-pointer"
        >
          Refresh List
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
      {photos.map((photo) => {
        const isSelected = selectedId === photo.id;
        return (
          <button
            key={photo.id}
            type="button"
            onClick={() => onSelect(photo)}
            className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-3 transition ${
              isSelected 
                ? "bg-dawn-950/20 border-dawn-700 text-white shadow-lg" 
                : "bg-stone-950/40 border-stone-850 text-stone-400 hover:bg-stone-900/60 hover:text-stone-200"
            }`}
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-900 shrink-0 border border-stone-800/40">
              <img 
                src={photo.src} 
                alt="" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold truncate">{photo.title || "Untitled"}</p>
              <p className="text-[9px] text-stone-600 font-mono mt-0.5 truncate uppercase tracking-wider">{photo.category}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function AdminUploadPage() {
  const [pendingFiles, setPendingFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtractingExif, setIsExtractingExif] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // CMS States
  const [activeTab, setActiveTab] = useState<"pending" | "published">("pending");
  const [publishedPhotos, setPublishedPhotos] = useState<any[]>([]);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Form Fields
  const [photoId, setPhotoId] = useState("");
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("nature");
  const [featured, setFeatured] = useState(true);
  const [createdAt, setCreatedAt] = useState("");
  const [exif, setExif] = useState<ExifData>({
    camera: "",
    lens: "",
    focalLength: "",
    aperture: "",
    shutterSpeed: "",
    iso: "",
    location: "",
  });

  // Adjustments States
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Watermark States
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [watermarkText, setWatermarkText] = useState("© Akash Photography");
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>("southeast");

  // Cropper States
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImgRef(e.currentTarget);
  };

  // Fetch pending files
  const fetchPendingFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const res = await fetch("/api/admin/pending");
      const data = await res.json();
      if (data.files) {
        setPendingFiles(data.files);
      } else if (data.error) {
        console.error("Error fetching files:", data.error);
      }
    } catch (err) {
      console.error("Failed to load files", err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // Fetch published photos
  const fetchPublishedPhotos = async () => {
    try {
      const res = await fetch("/api/admin/published");
      const data = await res.json();
      if (data.photos) {
        setPublishedPhotos(data.photos);
      }
    } catch (err) {
      console.error("Failed to load published photos", err);
    }
  };

  useEffect(() => {
    fetchPendingFiles();
    fetchPublishedPhotos();
  }, []);

  useEffect(() => {
    if (activeTab === "published") {
      fetchPublishedPhotos();
    }
  }, [activeTab]);

  const handleSelectPublishedFile = (photo: any) => {
    setEditingPhotoId(photo.id);
    setSelectedFile(photo.src);
    setStatusMessage(null);
    setConfirmDelete(false);

    // Reset crop & adjustments (since it is already processed)
    setCrop(undefined);
    setCompletedCrop(null);
    setImgRef(null);
    setBrightness(1);
    setContrast(1);
    setSaturation(1);
    setRotation(0);
    setWatermarkEnabled(false);

    // Populate metadata
    setPhotoId(photo.id);
    setTitle(photo.title || "");
    setAlt(photo.alt || "");
    setDescription(photo.description || "");
    setCategory(photo.category);
    setFeatured(photo.featured);
    setCreatedAt(photo.createdAt);
    setExif({
      camera: photo.exif?.camera || "",
      lens: photo.exif?.lens || "",
      focalLength: photo.exif?.focalLength || "",
      aperture: photo.exif?.aperture || "",
      shutterSpeed: photo.exif?.shutterSpeed || "",
      iso: photo.exif?.iso || "",
      location: photo.exif?.location || "",
    });
  };

  const handleDelete = async () => {
    if (!editingPhotoId) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/published?id=${encodeURIComponent(editingPhotoId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: `Successfully deleted photo from your exhibition.`,
        });
        setEditingPhotoId(null);
        setSelectedFile(null);
        setConfirmDelete(false);
        fetchPublishedPhotos();
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to delete photo.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "An error occurred while deleting photo.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle select pending file
  const handleSelectFile = async (filename: string) => {
    setSelectedFile(filename);
    setStatusMessage(null);
    setIsExtractingExif(true);

    // Reset crop states
    setCrop(undefined);
    setCompletedCrop(null);
    setImgRef(null);

    // Reset adjustments
    setBrightness(1);
    setContrast(1);
    setSaturation(1);
    setRotation(0);
    setWatermarkEnabled(false);
    setWatermarkText("© Akash Photography");
    setWatermarkPosition("southeast");

    // Auto-generate safe ID
    const baseName = filename
      .toLowerCase()
      .replace(/\.[^/.]+$/, "") // remove extension
      .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphen
      .replace(/(^-|-$)/g, ""); // trim hyphens
    
    setPhotoId(`gal-${baseName}`);
    setTitle(
      filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase())
    );
    setAlt(`Photograph titled ${filename.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ")}`);
    setDescription("");
    setCategory("nature");
    setFeatured(true);

    // Fetch EXIF metadata
    try {
      const res = await fetch(`/api/admin/exif?file=${encodeURIComponent(filename)}`);
      const data = await res.json();
      if (res.ok && data.exif) {
        setExif({
          camera: data.exif.camera || "",
          lens: data.exif.lens || "",
          focalLength: data.exif.focalLength || "",
          aperture: data.exif.aperture || "",
          shutterSpeed: data.exif.shutterSpeed || "",
          iso: data.exif.iso || "",
          location: data.exif.location || "",
        });
        if (data.createdAt) {
          setCreatedAt(data.createdAt);
        }
      } else {
        console.warn("Could not retrieve EXIF data or error:", data.error);
        resetExifForm();
      }
    } catch (err) {
      console.error("Failed to fetch EXIF metadata", err);
      resetExifForm();
    } finally {
      setIsExtractingExif(false);
    }
  };



  const resetExifForm = () => {
    setCreatedAt(new Date().toISOString().split("T")[0]);
    setExif({
      camera: "",
      lens: "",
      focalLength: "",
      aperture: "",
      shutterSpeed: "",
      iso: "",
      location: "",
    });
  };

  const updatePublishedPhoto = async () => {
    try {
      const res = await fetch("/api/admin/published", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: photoId,
          title,
          alt,
          description,
          category,
          featured,
          createdAt,
          exif,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: `Successfully updated metadata for "${title}"!`,
        });
        setEditingPhotoId(null);
        setSelectedFile(null);
        fetchPublishedPhotos();
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to update metadata.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "An error occurred while updating metadata.",
      });
    }
  };

  const processNewPhoto = async () => {
    // Calculate natural (original) size crop coordinates if crop is present
    let cropData = undefined;
    if (completedCrop && imgRef && completedCrop.width > 0 && completedCrop.height > 0) {
      const scaleX = imgRef.naturalWidth / imgRef.width;
      const scaleY = imgRef.naturalHeight / imgRef.height;
      cropData = {
        left: Math.max(0, Math.round(completedCrop.x * scaleX)),
        top: Math.max(0, Math.round(completedCrop.y * scaleY)),
        width: Math.min(imgRef.naturalWidth, Math.round(completedCrop.width * scaleX)),
        height: Math.min(imgRef.naturalHeight, Math.round(completedCrop.height * scaleY)),
      };
    }

    try {
      const res = await fetch("/api/admin/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedFile,
          id: photoId,
          title,
          alt,
          description,
          category,
          featured,
          createdAt,
          exif,
          crop: cropData,
          adjustments: {
            brightness,
            contrast,
            saturation,
            rotation,
          },
          watermark: {
            enabled: watermarkEnabled,
            text: watermarkText,
            position: watermarkPosition,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: `Successfully processed and imported "${title}" to your gallery!`,
        });
        
        const finishedFile = selectedFile;
        setSelectedFile(null);
        
        // Automatically load the next file in the queue
        const remainingQueue = pendingFiles.filter(f => f !== finishedFile);
        await fetchPendingFiles();
        
        if (remainingQueue.length > 0) {
          handleSelectFile(remainingQueue[0]);
        }
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to process image.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "An error occurred during image processing.",
      });
    }
  };

  // Submit process
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsProcessing(true);
    setStatusMessage(null);

    if (editingPhotoId) {
      await updatePublishedPhoto();
    } else {
      await processNewPhoto();
    }
    setIsProcessing(false);
  };

  let submitButtonText = "";
  if (editingPhotoId) {
    submitButtonText = "Save Changes";
  } else {
    submitButtonText = "Process & Save to Exhibition";
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Background radial glows matching photography theme */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-dawn-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] xl:max-w-[1850px] w-full mx-auto flex flex-col min-h-full">
        {/* Navigation & Header */}
        <StudioHeader 
          selectedFile={selectedFile}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Status Notification Alert */}
        <StatusBanner statusMessage={statusMessage} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                 {/* Column 1: Pending & Published list (span 3) */}
          <div className={`${(isSidebarOpen || !selectedFile) ? "lg:col-span-3" : "hidden"} bg-stone-900/60 backdrop-blur-md rounded-2xl border border-stone-850 p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-dawn-500" />
                Exhibition Manager
              </h2>
            </div>

            {/* Tab Swapper */}
            <div className="flex gap-1.5 p-1 bg-stone-950 rounded-xl mb-6 border border-stone-850">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("pending");
                  setSelectedFile(null);
                  setEditingPhotoId(null);
                  setStatusMessage(null);
                }}
                className={`flex-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeTab === "pending"
                    ? "bg-stone-850 text-white shadow"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                Queue ({pendingFiles.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("published");
                  setSelectedFile(null);
                  setEditingPhotoId(null);
                  setStatusMessage(null);
                }}
                className={`flex-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeTab === "published"
                    ? "bg-stone-850 text-white shadow"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                Published ({publishedPhotos.length})
              </button>
            </div>

            {activeTab === "pending" ? (
              <>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                  Place raw camera photos in the local project directory under <code className="bg-stone-950 px-1.5 py-0.5 rounded text-dawn-400 font-mono">/images-to-process/</code> to import them.
                </p>
                <PendingQueue
                  isLoadingFiles={isLoadingFiles}
                  pendingFiles={pendingFiles}
                  selectedFile={selectedFile}
                  handleSelectFile={handleSelectFile}
                  fetchPendingFiles={fetchPendingFiles}
                />
              </>
            ) : (
              <>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                  Manage your imported portfolio photos. Click any photo below to update its exhibition metadata or remove it.
                </p>
                <PublishedQueue
                  photos={publishedPhotos}
                  selectedId={editingPhotoId}
                  onSelect={handleSelectPublishedFile}
                  onRefresh={fetchPublishedPhotos}
                />
              </>
            )}
          </div>

          {/* Form and Workspace Area */}
          <div className={`${(isSidebarOpen || !selectedFile) ? "lg:col-span-9" : "lg:col-span-12"} transition-all duration-350`}>
            {selectedFile ? (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                
                {/* Column 2: Sticky Image Workspace & Adjustments */}
                <div className={`${isSidebarOpen ? "lg:col-span-8" : "lg:col-span-9"} lg:sticky lg:top-6 space-y-6`}>
                  {/* Unified Canvas & Color Laboratory Card (Vertical Layout with Horizontal Sliders) */}
                  <div className="bg-stone-900/60 backdrop-blur-md rounded-2xl border border-stone-850 p-6">
                    <WorkspaceCanvas
                      editingPhotoId={editingPhotoId}
                      selectedFile={selectedFile}
                      crop={crop}
                      setCrop={setCrop}
                      setCompletedCrop={setCompletedCrop}
                      onImageLoad={onImageLoad}
                      brightness={brightness}
                      setBrightness={setBrightness}
                      contrast={contrast}
                      setContrast={setContrast}
                      saturation={saturation}
                      setSaturation={setSaturation}
                      rotation={rotation}
                      setRotation={setRotation}
                    />
                  </div>
                </div>

                {/* Column 3: Metadata & Exif Form */}
                <div className={`${isSidebarOpen ? "lg:col-span-4" : "lg:col-span-3"} bg-stone-900/60 backdrop-blur-md rounded-2xl border border-stone-850 p-6 md:p-8 space-y-6`}>
                  <div className="flex justify-between items-center border-b border-stone-800 pb-4 mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-dawn-500" />
                      Configure Image & Metadata
                    </h2>
                    <span className="text-[11px] bg-stone-800 border border-stone-750 px-2.5 py-1 rounded-full font-mono text-stone-400 max-w-[150px] truncate">
                      {selectedFile}
                    </span>
                  </div>

                  {isExtractingExif ? (
                    <div className="flex flex-col items-center justify-center py-20 text-stone-500">
                      <Loader2 className="w-8 h-8 animate-spin text-dawn-500 mb-2" />
                      <span className="text-xs">Extracting image EXIF profile...</span>
                    </div>
                  ) : (
                    <>
                      {/* Database Identity */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="photoId" className="block text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-2">
                            Unique ID (for URL and filename)
                          </label>
                          <input
                            id="photoId"
                            type="text"
                            required
                            disabled={!!editingPhotoId}
                            value={photoId}
                            onChange={(e) => setPhotoId(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-dawn-500 transition disabled:text-stone-500 disabled:border-stone-900 disabled:bg-stone-950/60 disabled:cursor-not-allowed"
                            placeholder="e.g. gal-kashmir-dawn"
                          />
                        </div>
                        <div>
                          <label htmlFor="title" className="block text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-2">
                            Exhibition Title
                          </label>
                          <input
                            id="title"
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-dawn-500 transition"
                            placeholder="e.g. Alpine Awakening"
                          />
                        </div>
                      </div>

                      {/* Image Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="category" className="block text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-2">
                            Gallery Category
                          </label>
                          <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-dawn-500 transition cursor-pointer"
                          >
                            <option value="nature">Nature & Wilderness</option>
                            <option value="portrait">Portrait & Human</option>
                            <option value="street">Street & Urban</option>
                            <option value="architecture">Architecture & Structure</option>
                            <option value="other">Other Explorations</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="createdAt" className="block text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-2">
                            Capture Date
                          </label>
                          <input
                            id="createdAt"
                            type="date"
                            required
                            value={createdAt}
                            onChange={(e) => setCreatedAt(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-dawn-500 transition cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Alt Text & Story */}
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="alt" className="block text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-2">
                            Accessibility Alt Text (For screen readers)
                          </label>
                          <input
                            id="alt"
                            type="text"
                            required
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-dawn-500 transition"
                            placeholder="Mist-shrouded mountain peaks at dawn..."
                          />
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-2">
                            Backstory / Description (Optional)
                          </label>
                          <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-dawn-500 transition resize-none"
                            placeholder="A brief sentence about when or why you took this shot..."
                          />
                        </div>
                      </div>

                      <hr className="border-stone-800" />

                      {/* EXIF Metadata Block */}
                      <ExifMetadataSection
                        exif={exif}
                        onChange={setExif}
                      />

                      <hr className="border-stone-800" />

                      {/* Signature Watermarking */}
                      <WatermarkSection
                        enabled={watermarkEnabled}
                        setEnabled={setWatermarkEnabled}
                        text={watermarkText}
                        setText={setWatermarkText}
                        position={watermarkPosition}
                        setPosition={setWatermarkPosition}
                      />

                      {/* Options */}
                      <div className="flex items-center gap-6 bg-stone-950/40 p-4 rounded-xl border border-stone-850">
                        <label htmlFor="featured" className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-stone-300">
                          <input
                            id="featured"
                            type="checkbox"
                            checked={featured}
                            onChange={(e) => setFeatured(e.target.checked)}
                            className="w-4.5 h-4.5 bg-stone-900 border border-stone-800 rounded text-dawn-600 focus:ring-dawn-500"
                          />
                          <span>Feature on Main Portfolio Landing Page</span>
                        </label>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-850">
                        {editingPhotoId ? (
                          <div className="flex items-center gap-2">
                            {confirmDelete ? (
                              <>
                                <button
                                  type="button"
                                  onClick={handleDelete}
                                  disabled={isProcessing}
                                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-stone-950 font-bold text-xs transition cursor-pointer"
                                >
                                  Yes, Delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDelete(false)}
                                  className="px-4 py-2 rounded-xl border border-stone-850 text-stone-450 hover:text-white text-xs transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDelete(true)}
                                className="px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900/40 text-rose-350 font-bold text-xs transition cursor-pointer"
                              >
                                Delete Photo
                              </button>
                            )}
                          </div>
                        ) : (
                          <div />
                        )}

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setEditingPhotoId(null);
                              setConfirmDelete(false);
                            }}
                            className="px-5 py-2.5 rounded-xl border border-stone-805 text-xs font-bold text-stone-400 hover:text-white hover:bg-stone-900 transition cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isProcessing}
                            className="px-6 py-2.5 rounded-xl bg-dawn-600 hover:bg-dawn-500 disabled:bg-stone-800 font-bold text-xs text-stone-950 disabled:text-stone-600 transition flex items-center gap-2 shadow-lg shadow-dawn-900/10 cursor-pointer"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {editingPhotoId ? "Saving..." : "Optimizing & Importing..."}
                              </>
                            ) : (
                              submitButtonText
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </form>
            ) : (
              <EmptyWorkspaceState />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
