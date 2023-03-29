FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
);

FilePond.setOptions({
    stylePanelAspectRatio :9 / 16,
    imageResizeTargetWidth : 160,
    imageResizeTargetHeight : 90
})

FilePond.parse(document.body);