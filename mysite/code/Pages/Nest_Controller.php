<?php

class Nest_Controller extends ContentController
{

    public function init() {
        parent::init();
        // You can include any CSS or JS required by your project here.
        // See: http://doc.silverstripe.org/framework/en/reference/requirements
    }

    public function index()
    {
        if (Director::is_ajax()) {
            return $this->renderWith("Ajax/" . $this->ClassName);
        } else {
            return $this->render();
        }
    }
}
