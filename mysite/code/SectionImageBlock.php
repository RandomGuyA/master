<?php

class SectionImageBlock extends Section {

    private static $db = array(

    );

    private static $has_one = array(
        'Photo' => 'Image'
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $uploadField = UploadField::create('Photo');
        $uploadField->setFolderName('SectionBlockImages');
        $uploadField->getValidator()->setAllowedExtensions(array(
            'png','gif','jpeg','jpg'
        ));

        $fields->addFieldToTab("Root.Main", $uploadField);

        return $fields;
    }



}