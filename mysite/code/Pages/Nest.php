<?php

class Nest extends Page
{

    private static $db = array(
        'Container'=>'Boolean'
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();
        $fields->addFieldToTab('Root.Animation', CheckboxField::create('Container', 'Container'));

        return $fields;
    }
}
