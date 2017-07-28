<?php

class Page extends SiteTree
{

    public static $allowed_actions = array (
    );

    private static $db = array(
        'Transition_inc'=>'Varchar(100)',
        'Transition_dec'=>'Varchar(100)',
        'Nest'=>'Boolean'
    );

    private static $has_one = array(
    );

    private static $has_many = array(
        'Sections' => 'Section'
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();


        /*********************************
         *      COMPONENT BUILDER
         ********************************/

        $dataColumns = new GridFieldDataColumns();
        $dataColumns->setDisplayFields(
            array(

                'ClassName' => 'Class Name'
            )
        );

        $multiClassConfig = new GridFieldAddNewMultiClass();
        $multiClassConfig->setClasses(
            array(
                'SectionImageBlock' => SectionImageBlock::get_section_type(),
                'SectionTextBlock'  => SectionTextBlock::get_section_type(),
                'SectionConversationBlock'  => SectionConversationBlock::get_section_type(),
                'SectionGalleryBlock'  => SectionGalleryBlock::get_section_type(),
                'SectionYouTubeVideoBlock'  => SectionYouTubeVideoBlock::get_section_type(),
                'SectionLinkBlock'  => SectionLinkBlock::get_section_type(),
                'SectionRevealAnswerBlock'  => SectionRevealAnswerBlock::get_section_type(),
                'SectionAudioBlock'  => SectionAudioBlock::get_section_type(),
            )
        );

        $config = GridFieldConfig_RelationEditor::create()
            ->removeComponentsByType('GridFieldAddNewButton')
            ->addComponents(
                new GridFieldOrderableRows('SortOrder'),
                new GridFieldDeleteAction(),
                $multiClassConfig,
                $dataColumns
            );

        $gridField = GridField::create('Sections', "Sections", $this->Sections(), $config);
        $fields->addFieldToTab("Root.Sections", $gridField);


        /*********************************
         *          ANIMATION
         ********************************/

        $transitions = array(
            'slide-right' => 'Slide Right',
            'slide-left' => 'Slide Left',
            'fade' => 'Fade',
            'slide-down' => 'Slide Down',
            'slide-up' => 'Slide Up',
            'scale-down' => 'Scale Down',
            'scale-up' => 'Scale Up',
        );
        $fields->addFieldToTab('Root.Animation',
            DropdownField::create(
                'Transition_inc',
                'Transition Increment',
                $transitions
            )
        );
        $fields->addFieldToTab('Root.Animation',
            DropdownField::create(
                'Transition_dec',
                'Transition Decrement',
                $transitions
            )
        );
        $fields->addFieldToTab('Root.Animation', CheckboxField::create('Nest', 'Nest'));

        return $fields;
    }

    public function populateDefaults()
    {
        $this->Transition_inc = "silde-left";
        $this->Transition_dec = "slide-right";
        parent::populateDefaults();
    }

}
