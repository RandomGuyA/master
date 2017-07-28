<?php

class SectionGalleryBlock extends Section
{

    public static $db = array();

    public static $has_many = array(
        'GalleryImages' => 'ImageResource'
    );

    public static $has_one = array();

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $dataColumns = new GridFieldDataColumns();
        $dataColumns->setDisplayFields(
            array(
                'ID' => 'ID',
                'ClassName' => 'Class Name',

            )
        );

        //---------------------- Main  ----------------------//

        $saveWarning = LiteralField::create("Warning", "<p class='cms-warning-label'>You must first save the Gallery block before adding gallery images</p>");

        $images = GridField::create('GalleryImages', 'Gallery Images', $this->GalleryImages(),
            GridFieldConfig::create()->addComponents(
                $dataColumns,
                new GridFieldToolbarHeader(),
                new GridFieldAddNewButton('toolbar-header-right'),
                new GridFieldDetailForm(),
                new GridFieldEditButton(),
                new GridFieldDeleteAction('unlinkrelation'),
                new GridFieldDeleteAction(),
                new GridFieldTitleHeader(),
                new GridFieldAddExistingAutocompleter('before', array('Title'))
            )
        );

        if (!$this->ID) {
            $images->getConfig()->removeComponentsByType('GridFieldAddNewButton');
            $fields->addFieldToTab('Root.Main', $saveWarning);
        }

        $fields->addFieldToTab('Root.Main', $images);
        $this->removeEmptyTabs($fields);

        return $fields;
    }
}