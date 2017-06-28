<?php

class SectionImageBlock extends Section {

    private static $db = array(
        'caption' => 'VarChar(100)',
        'alt' => 'VarChar(100)',
        'width' => 'VarChar(30)',
        'align' => 'VarChar(30)',
        'border' => 'Boolean'
    );

    private static $has_one = array(
        'Photo' => 'Image'
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $widths = array(
            'full-width' => 'Full width',
            'large' => 'Large',
            'medium' => 'Medium',
            'small' => 'Small'
        );

        $alignment = array(
            'center' => 'Center',
            'left' => 'Left',
            'right' => 'Right'
        );

        $fieldList = array(
            TextField::create( 'caption','Caption'),
            TextField::create('alt', 'Alt'),
            DropdownField::create('width', 'Width',  $widths),
            DropdownField::create('align', 'Align',  $alignment),
            CheckboxField::create('border', 'Border')
        );

        $fields->addFieldsToTab("Root.Main", $fieldList);

        $uploadField = UploadField ::create('Photo');
        $uploadField->setFolderName('SectionBlockImages');
        $uploadField->getValidator()->setAllowedExtensions(array(
            'png','gif','jpeg','jpg'
        ));

        $fields->addFieldToTab("Root.Main", $uploadField);

        return $fields;
    }

    public function populateDefaults()
    {
        $this->width = "full-width";
        $this->align = "center";
        parent::populateDefaults();
    }
}
