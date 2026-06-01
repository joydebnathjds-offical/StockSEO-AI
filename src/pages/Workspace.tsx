import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { generateMetadata, regenerateField, PLATFORM_RULES } from "../lib/aiEngine";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/GlassCard";
import { SEOScoreRing } from "../components/ui/SEOScoreRing";
import {
  Upload, ImagePlus, Zap, RefreshCw, Copy, Edit3, Check,
  X, Sliders, Tag, FileText, Type, Info, ChevronDown, ChevronUp,
  Layers, Target, BarChart2,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "../utils/cn";

const TITLE_OPTIONS = [80, 100, 120, 150];
const DESC_OPTIONS = [150, 200, 300, 400];
const TAG_OPTIONS = [30, 40, 50];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export const Workspace: React.FC = () => {
  const {
    currentUser, setShowPaywall, deductCredit,
    uploadedFiles, setUploadedFiles,
    currentAsset, setCurrentAsset, addGeneratedAsset,
    titleLength, setTitleLength,
    descriptionLength, setDescriptionLength,
    tagCount, setTagCount,
    selectedPlatform, selectedEngine,
    isGenerating, setIsGenerating,
    generatingField, setGeneratingField,
  } = useAppStore();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<"title" | "description" | "tags" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(true);
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!currentUser) {
      toast.error("Please sign in to upload images");
      return;
    }
    setUploadedFiles(acceptedFiles);
    setSelectedFileIdx(0);
    setCurrentAsset(null);
    if (acceptedFiles[0]) {
      const url = URL.createObjectURL(acceptedFiles[0]);
      setPreviewUrl(url);
    }
  }, [currentUser, setUploadedFiles, setCurrentAsset]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/tiff": [".tiff", ".tif"],
    },
    multiple: true,
  });

  const handleGenerate = async () => {
    if (!currentUser) { toast.error("Sign in required"); return; }
    if (!uploadedFiles.length) { toast.error("Please upload at least one image"); return; }
    if (currentUser.credits <= 0) { setShowPaywall(true); return; }

    const canProceed = deductCredit();
    if (!canProceed) return;

    setIsGenerating(true);
    setGeneratingField("all");

    try {
      const file = uploadedFiles[selectedFileIdx];
      const result = await generateMetadata({
        engine: selectedEngine,
        titleLength,
        descriptionLength,
        tagCount,
        platform: selectedPlatform,
        imageFile: file,
      });

      const img = new Image();
      img.src = previewUrl || "";

      const asset = {
        id: `asset_${Date.now()}`,
        filename: file.name,
        size: file.size,
        resolution: `${img.naturalWidth || 0}×${img.naturalHeight || 0}`,
        previewUrl: previewUrl || "",
        ...result,
        platform: selectedPlatform,
        generatedAt: new Date().toISOString(),
        titleLength,
        descriptionLength,
        tagCount,
      };

      setCurrentAsset(asset);
      addGeneratedAsset(asset);
      toast.success("✨ Metadata generated successfully!", { duration: 3000 });
    } catch (e) {
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
      setGeneratingField(null);
    }
  };

  const handleRegenerateField = async (field: "title" | "description" | "tags") => {
    if (!currentAsset || !currentUser) return;
    if (currentUser.credits <= 0) { setShowPaywall(true); return; }

    const canProceed = deductCredit();
    if (!canProceed) return;

    setGeneratingField(field);

    try {
      const result = await regenerateField(field, {
        engine: selectedEngine,
        titleLength,
        descriptionLength,
        tagCount,
        platform: selectedPlatform,
      });

      setCurrentAsset({ ...currentAsset, ...result });
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} regenerated!`);
    } catch {
      toast.error("Regeneration failed");
    } finally {
      setGeneratingField(null);
    }
  };

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedField(field);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStartEdit = (field: "title" | "description" | "tags", value: string | string[]) => {
    setEditingField(field);
    setEditValue(Array.isArray(value) ? value.join(", ") : value);
  };

  const handleSaveEdit = () => {
    if (!currentAsset || !editingField) return;
    if (editingField === "tags") {
      const tags = editValue.split(",").map((t) => t.trim()).filter(Boolean);
      setCurrentAsset({ ...currentAsset, tags });
    } else {
      setCurrentAsset({ ...currentAsset, [editingField]: editValue });
    }
    setEditingField(null);
    toast.success("Changes saved");
  };

  const platformRules = PLATFORM_RULES[selectedPlatform];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">

        {/* Left Panel: Upload + Settings */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">

          {/* Upload Zone */}
          <GlassCard className="overflow-hidden">
            <div className="p-4 border-b border-[var(--color-glass-border)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                <ImagePlus className="w-4 h-4 text-cyan-400 dark:text-pink-400" />
                Upload Images
              </div>
              {uploadedFiles.length > 0 && (
                <span className="text-xs text-[var(--color-text-muted)]">{uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""}</span>
              )}
            </div>

            <div className="p-4">
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200",
                  isDragActive
                    ? "border-cyan-400 dark:border-pink-400 bg-cyan-400/5 dark:bg-pink-400/5"
                    : "border-[var(--color-glass-border)] hover:border-cyan-400/60 dark:hover:border-pink-400/60 hover:bg-white/3"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    isDragActive ? "btn-gradient" : "glass-surface"
                  )}>
                    <Upload className={cn("w-6 h-6", isDragActive ? "text-white" : "text-[var(--color-text-muted)]")} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {isDragActive ? "Drop images here" : "Drag & drop images"}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">JPG, PNG, WEBP, TIFF supported</p>
                  </div>
                  <Button variant="outline" size="sm">Browse Files</Button>
                </div>
              </div>

              {/* File list */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
                  {uploadedFiles.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedFileIdx(idx);
                        setPreviewUrl(URL.createObjectURL(file));
                        setCurrentAsset(null);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 p-2 rounded-lg transition-all text-left cursor-pointer",
                        selectedFileIdx === idx
                          ? "bg-cyan-400/10 dark:bg-pink-400/10 border border-cyan-400/30 dark:border-pink-400/30"
                          : "hover:bg-white/5"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-[var(--color-text)] truncate">{file.name}</div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">{formatFileSize(file.size)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>

          {/* Generation Settings */}
          <GlassCard>
            <button
              className="w-full p-4 border-b border-[var(--color-glass-border)] flex items-center justify-between cursor-pointer"
              onClick={() => setShowSettings((v) => !v)}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                <Sliders className="w-4 h-4 text-cyan-400 dark:text-pink-400" />
                Output Settings
              </div>
              {showSettings ? <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />}
            </button>

            {showSettings && (
              <div className="p-4 space-y-5">
                {/* Title Length */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[var(--color-text-muted)]">Title Length</span>
                    <span className="text-xs font-bold text-cyan-400 dark:text-pink-400">{titleLength} chars</span>
                  </div>
                  <div className="flex gap-1.5">
                    {TITLE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setTitleLength(opt)}
                        className={cn(
                          "flex-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border",
                          titleLength === opt
                            ? "btn-gradient text-white border-transparent"
                            : "border-[var(--color-glass-border)] text-[var(--color-text-muted)] hover:border-cyan-400/40"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description Length */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[var(--color-text-muted)]">Description Length</span>
                    <span className="text-xs font-bold text-cyan-400 dark:text-pink-400">{descriptionLength} chars</span>
                  </div>
                  <div className="flex gap-1.5">
                    {DESC_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setDescriptionLength(opt)}
                        className={cn(
                          "flex-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border",
                          descriptionLength === opt
                            ? "btn-gradient text-white border-transparent"
                            : "border-[var(--color-glass-border)] text-[var(--color-text-muted)] hover:border-cyan-400/40"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tag Count */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[var(--color-text-muted)]">SEO Tags Count</span>
                    <span className="text-xs font-bold text-cyan-400 dark:text-pink-400">{tagCount} tags</span>
                  </div>
                  <div className="flex gap-1.5">
                    {TAG_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setTagCount(opt)}
                        className={cn(
                          "flex-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border",
                          tagCount === opt
                            ? "btn-gradient text-white border-transparent"
                            : "border-[var(--color-glass-border)] text-[var(--color-text-muted)] hover:border-cyan-400/40"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform rules info */}
                <div className="p-3 rounded-xl glass-surface border border-[var(--color-glass-border)] text-xs">
                  <div className="flex items-center gap-1.5 mb-2 text-violet-400 font-semibold">
                    <Info className="w-3.5 h-3.5" />
                    {platformRules.name} Guidelines
                  </div>
                  <div className="space-y-1 text-[var(--color-text-muted)]">
                    <div className="flex justify-between"><span>Max Title</span><span className="font-semibold">{platformRules.maxTitle} chars</span></div>
                    <div className="flex justify-between"><span>Max Tags</span><span className="font-semibold">{platformRules.maxTags} tags</span></div>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Generate button */}
          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            loading={isGenerating}
            onClick={handleGenerate}
            disabled={!uploadedFiles.length || !currentUser}
          >
            {isGenerating ? "Generating..." : (
              <>
                <Zap className="w-5 h-5" />
                Generate Metadata
              </>
            )}
          </Button>

          {!currentUser && (
            <p className="text-xs text-center text-[var(--color-text-muted)]">
              <button className="text-cyan-400 dark:text-pink-400 font-semibold cursor-pointer hover:underline" onClick={() => useAppStore.getState().setShowAuthModal(true)}>Sign in</button> to start generating
            </p>
          )}
        </div>

        {/* Center Panel: Preview */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto">

          {/* Image preview */}
          <GlassCard className="overflow-hidden">
            <div className="aspect-video relative bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 opacity-40">
                  <ImagePlus className="w-16 h-16 text-[var(--color-text-muted)]" />
                  <p className="text-sm text-[var(--color-text-muted)]">Upload an image to preview</p>
                </div>
              )}

              {/* Generating overlay */}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 dark:border-t-pink-400 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-violet-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                    <Zap className="absolute inset-0 m-auto w-5 h-5 text-cyan-400 dark:text-pink-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">AI Analyzing Image</p>
                    <p className="text-white/60 text-xs mt-1">Generating SEO-optimized metadata...</p>
                  </div>
                </div>
              )}

              {/* File info overlay */}
              {uploadedFiles[selectedFileIdx] && previewUrl && !isGenerating && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <span className="font-medium truncate">{uploadedFiles[selectedFileIdx].name}</span>
                    <span>{formatFileSize(uploadedFiles[selectedFileIdx].size)}</span>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Generated metadata panels */}
          <AnimatePresence>
            {currentAsset && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Title panel */}
                <MetadataPanel
                  label="Title"
                  icon={<Type className="w-4 h-4" />}
                  field="title"
                  value={currentAsset.title}
                  maxLength={titleLength}
                  isGenerating={generatingField === "title"}
                  isLocked={generatingField !== null && generatingField !== "title"}
                  editingField={editingField}
                  editValue={editValue}
                  copiedField={copiedField}
                  onStartEdit={handleStartEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingField(null)}
                  onEditValueChange={setEditValue}
                  onCopy={handleCopy}
                  onRegenerate={handleRegenerateField}
                />

                {/* Description panel */}
                <MetadataPanel
                  label="Description"
                  icon={<FileText className="w-4 h-4" />}
                  field="description"
                  value={currentAsset.description}
                  maxLength={descriptionLength}
                  isGenerating={generatingField === "description"}
                  isLocked={generatingField !== null && generatingField !== "description"}
                  editingField={editingField}
                  editValue={editValue}
                  copiedField={copiedField}
                  onStartEdit={handleStartEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingField(null)}
                  onEditValueChange={setEditValue}
                  onCopy={handleCopy}
                  onRegenerate={handleRegenerateField}
                  multiline
                />

                {/* Tags panel */}
                <TagsPanel
                  tags={currentAsset.tags}
                  field="tags"
                  isGenerating={generatingField === "tags"}
                  isLocked={generatingField !== null && generatingField !== "tags"}
                  editingField={editingField}
                  editValue={editValue}
                  copiedField={copiedField}
                  onStartEdit={handleStartEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingField(null)}
                  onEditValueChange={setEditValue}
                  onCopy={handleCopy}
                  onRegenerate={handleRegenerateField}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel: SEO Score + Info */}
        {currentAsset && (
          <motion.div
            className="w-64 flex-shrink-0 flex flex-col gap-4 overflow-y-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* SEO Score */}
            <GlassCard className="p-5 flex flex-col items-center">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] mb-4 self-start">
                <BarChart2 className="w-4 h-4 text-cyan-400 dark:text-pink-400" />
                SEO Analysis
              </div>
              <SEOScoreRing score={currentAsset.seoScore} size={140} />

              <div className="w-full mt-4 space-y-3">
                <ScoreBar label="Keyword Density" value={Math.min(100, currentAsset.tags.length * 2)} />
                <ScoreBar label="Title Optimization" value={Math.min(100, (currentAsset.title.length / titleLength) * 100)} />
                <ScoreBar label="Description Depth" value={Math.min(100, (currentAsset.description.length / descriptionLength) * 100)} />
                <ScoreBar label="Tag Coverage" value={Math.min(100, (currentAsset.tags.length / tagCount) * 100)} />
              </div>
            </GlassCard>

            {/* Category */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] mb-3">
                <Layers className="w-4 h-4 text-violet-400" />
                Classification
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-[var(--color-text-muted)]">Category</div>
                  <div className="text-xs font-semibold text-[var(--color-text)] mt-0.5">{currentAsset.category}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-muted)]">Subcategory</div>
                  <div className="text-xs font-semibold text-[var(--color-text)] mt-0.5">{currentAsset.subcategory}</div>
                </div>
              </div>
            </GlassCard>

            {/* Stats */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] mb-3">
                <Target className="w-4 h-4 text-emerald-400" />
                Metadata Stats
              </div>
              <div className="space-y-2">
                {[
                  { label: "Title", value: `${currentAsset.title.length} chars` },
                  { label: "Description", value: `${currentAsset.description.length} chars` },
                  { label: "Tags", value: `${currentAsset.tags.length} keywords` },
                  { label: "Platform", value: PLATFORM_RULES[currentAsset.platform]?.name || currentAsset.platform },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center text-xs">
                    <span className="text-[var(--color-text-muted)]">{label}</span>
                    <span className="font-semibold text-[var(--color-text)]">{value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

interface MetadataPanelProps {
  label: string;
  icon: React.ReactNode;
  field: "title" | "description";
  value: string;
  maxLength: number;
  isGenerating: boolean;
  isLocked: boolean;
  editingField: string | null;
  editValue: string;
  copiedField: string | null;
  onStartEdit: (field: "title" | "description" | "tags", value: string | string[]) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditValueChange: (v: string) => void;
  onCopy: (field: string, value: string) => void;
  onRegenerate: (field: "title" | "description" | "tags") => void;
  multiline?: boolean;
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({
  label, icon, field, value, maxLength, isGenerating, isLocked,
  editingField, editValue, copiedField, onStartEdit, onSaveEdit, onCancelEdit,
  onEditValueChange, onCopy, onRegenerate, multiline,
}) => {
  const isEditing = editingField === field;
  const pct = Math.min(100, (value.length / maxLength) * 100);
  const charColor = pct > 90 ? "text-amber-400" : pct > 100 ? "text-red-400" : "text-emerald-400";

  return (
    <GlassCard className={cn("overflow-hidden transition-all", isLocked && "opacity-50 pointer-events-none")}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-glass-border)]">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
          <span className="text-cyan-400 dark:text-pink-400">{icon}</span>
          {label}
          <span className={cn("text-xs font-normal ml-1", charColor)}>
            {value.length}/{maxLength}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ActionBtn
            icon={copiedField === field ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={() => onCopy(field, value)}
            title="Copy"
            active={copiedField === field}
          />
          <ActionBtn
            icon={isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            onClick={() => isEditing ? onSaveEdit() : onStartEdit(field, value)}
            title="Edit"
          />
          <ActionBtn
            icon={<RefreshCw className={cn("w-3.5 h-3.5", isGenerating && "animate-spin")} />}
            onClick={() => onRegenerate(field)}
            title="Regenerate"
            loading={isGenerating}
          />
          {isEditing && (
            <ActionBtn icon={<X className="w-3.5 h-3.5" />} onClick={onCancelEdit} title="Cancel" danger />
          )}
        </div>
      </div>

      {/* Length bar */}
      <div className="h-0.5 bg-white/5">
        <div className="progress-bar-fill h-full" style={{ width: `${pct}%` }} />
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          multiline ? (
            <textarea
              value={editValue}
              onChange={(e) => onEditValueChange(e.target.value)}
              className="input-glass w-full min-h-[80px] p-3 rounded-xl text-sm resize-none"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={(e) => onEditValueChange(e.target.value)}
              className="input-glass w-full px-3 py-2 rounded-xl text-sm"
              autoFocus
            />
          )
        ) : isGenerating ? (
          <div className="space-y-2">
            <div className="shimmer-loading h-4 rounded-lg" />
            {multiline && <div className="shimmer-loading h-4 rounded-lg w-4/5" />}
            {multiline && <div className="shimmer-loading h-4 rounded-lg w-3/5" />}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text)] leading-relaxed">{value}</p>
        )}
      </div>
    </GlassCard>
  );
};

interface TagsPanelProps {
  tags: string[];
  field: "tags";
  isGenerating: boolean;
  isLocked: boolean;
  editingField: string | null;
  editValue: string;
  copiedField: string | null;
  onStartEdit: (field: "title" | "description" | "tags", value: string | string[]) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditValueChange: (v: string) => void;
  onCopy: (field: string, value: string) => void;
  onRegenerate: (field: "title" | "description" | "tags") => void;
}

const TagsPanel: React.FC<TagsPanelProps> = ({
  tags, field, isGenerating, isLocked, editingField, editValue, copiedField,
  onStartEdit, onSaveEdit, onCancelEdit, onEditValueChange, onCopy, onRegenerate,
}) => {
  const isEditing = editingField === field;

  return (
    <GlassCard className={cn("overflow-hidden transition-all", isLocked && "opacity-50 pointer-events-none")}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-glass-border)]">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
          <Tag className="w-4 h-4 text-cyan-400 dark:text-pink-400" />
          SEO Keywords & Tags
          <span className="text-xs font-normal text-[var(--color-text-muted)]">{tags.length} tags</span>
        </div>
        <div className="flex items-center gap-1">
          <ActionBtn
            icon={copiedField === field ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={() => onCopy(field, tags.join(", "))}
            title="Copy all"
            active={copiedField === field}
          />
          <ActionBtn
            icon={isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            onClick={() => isEditing ? onSaveEdit() : onStartEdit(field, tags)}
            title="Edit"
          />
          <ActionBtn
            icon={<RefreshCw className={cn("w-3.5 h-3.5", isGenerating && "animate-spin")} />}
            onClick={() => onRegenerate(field)}
            title="Regenerate"
            loading={isGenerating}
          />
          {isEditing && (
            <ActionBtn icon={<X className="w-3.5 h-3.5" />} onClick={onCancelEdit} title="Cancel" danger />
          )}
        </div>
      </div>

      <div className="p-4">
        {isEditing ? (
          <div>
            <textarea
              value={editValue}
              onChange={(e) => onEditValueChange(e.target.value)}
              placeholder="Comma-separated tags..."
              className="input-glass w-full min-h-[80px] p-3 rounded-xl text-sm resize-none"
              autoFocus
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Separate tags with commas</p>
          </div>
        ) : isGenerating ? (
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="shimmer-loading h-6 rounded-full" style={{ width: `${60 + Math.random() * 60}px` }} />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span key={i} className="tag-badge">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

const ActionBtn: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  title?: string;
  active?: boolean;
  loading?: boolean;
  danger?: boolean;
}> = ({ icon, onClick, title, active, danger }) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      "w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer text-xs",
      active && "bg-emerald-400/10 text-emerald-400",
      danger && "bg-red-400/10 text-red-400 hover:bg-red-400/20",
      !active && !danger && "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/10"
    )}
  >
    {icon}
  </button>
);

const ScoreBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-[var(--color-text-muted)]">{label}</span>
      <span className="font-semibold text-[var(--color-text)]">{Math.round(value)}%</span>
    </div>
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div className="progress-bar-fill h-full" style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default Workspace;
