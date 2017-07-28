<?php


class SectionRevealAnswerBlock extends Section
{

    private static $db = array(
        'Question' => 'varchar(200)'
    );

    static $has_many = array(
        'Answers' => 'Answer'
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();
        $fields->addFieldToTab('Root.Main', TextField::create('Question', 'Question'));

        $dataColumns = new GridFieldDataColumns();
        $dataColumns->setDisplayFields(array('ID' => 'ID', 'ClassName' => 'Class Name', 'Answer' => 'Answer'));

        //---------------------- Main  ----------------------//

        $saveWarning = LiteralField::create("Warning", "<p class='cms-warning-label'>You must first save before adding answers</p>");

        $answers = GridField::create('Answers', 'Answers', $this->Answers(),
            GridFieldConfig::create()->addComponents(
                $dataColumns,
                new GridFieldToolbarHeader(),
                new GridFieldAddNewButton('toolbar-header-right'),
                new GridFieldDetailForm(),
                new GridFieldEditButton(),
                new GridFieldDeleteAction(),
                new GridFieldTitleHeader()
            )
        );

        if (!$this->ID) {
            $answers->getConfig()->removeComponentsByType('GridFieldAddNewButton');
            $fields->addFieldToTab('Root.Main', $saveWarning);
        }

        $fields->addFieldToTab('Root.Main', $answers);
        $this->removeEmptyTabs($fields);

        return $fields;
    }

}
