<?php

class ContactPage extends Page {

    private static $db = array(
    );

}

class ContactPage_Controller extends ContentController {
    public function index()
    {

        if (Director::is_ajax()) {
            return $this->renderWith("Ajax/" . $this->ClassName);
        } else {
            return $this->render();
        }
    }
}