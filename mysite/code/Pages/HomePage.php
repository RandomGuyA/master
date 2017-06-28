<?php

class HomePage extends Page {

    private static $db = array(
    );

}

class HomePage_Controller extends ContentController {
    public function index()
    {

        if (Director::is_ajax()) {
            return $this->renderWith("Ajax/" . $this->ClassName);
        } else {
            return $this->render();
        }
    }
}