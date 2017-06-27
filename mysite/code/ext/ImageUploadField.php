<?php


class ImageUploadField extends UploadField {
    protected function saveTemporaryFile($tmpFile, &$error = null) {
        $file = parent::saveTemporaryFile($tmpFile, $error);
        if ($file && is_a($file, 'Image')) {
            // only attempt to resize if it's an image
            $filePath = Director::baseFolder() . "/" . $file->Filename;
            // create a backend (either GDBackend or ImagickBackend depending on your settings)
            $backend = Injector::inst()->createWithArgs(Image::get_backend(), array($filePath));
            if ($backend->hasImageResource() && $backend->getHeight() > 100) {
                // if it is a working image and is higher than 100px, resize it to 100px height
                $newBackend = $backend->resizeByHeight(100);
                if ($newBackend) {
                    // resize successful, overwrite the existing file
                    $newBackend->writeTo($filePath);
                }
            }
        }
        return $file;
    }
}