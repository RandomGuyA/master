<?php


class SectionLinkBlock extends Section {

    private static $db = array(
        'href' => 'VarChar(250)',
        'name' => 'VarChar(100)',
        'prompt' => 'VarChar(100)',
        'internal' => 'Boolean'
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fieldList = array(
            TextField::create( 'href','Link'),
            TextField::create('name', 'Name'),
            TextField::create('prompt', 'Prompt'),
            CheckboxField::create('internal', 'Internal link')
        );

        $fields->addFieldsToTab("Root.Main", $fieldList);

        return $fields;
    }


    public function populateDefaults()
    {
        $this->prompt = "Cysallt";
        parent::populateDefaults();
    }
}
