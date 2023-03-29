FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
);

FilePond.setOptions({
    stylePanelAspectRatio : 150 / 100,
    imageResizeTargetWidth : 160,
    imageResizeTargetHeight : 90
})

FilePond.parse(document.body);