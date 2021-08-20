<?php 
    class Database {
        public $connection;
        public $lastId = 1;
        public $lastValue = 7;

        private $HOST = '127.0.0.1';
        private $USERNAME = 'root';
        private $PASSWORD = '';
        private $DB_NAME = 'contest';

        public function __construct () {
            $this->setConnection();
            $this->createTable();
        }

        public function setConnection() 
        {   
            $this->connection = new mysqli(
                $this->HOST, 
                $this->USERNAME, 
                $this->PASSWORD, 
                $this->DB_NAME
            );
        }

        public function createTable($table = 'us3477') {
            $sql = "CREATE TABLE IF NOT EXISTS $table  
                (
                    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    value INT(6) NOT NULL
                )";
            $this->connection->query($sql);
            
            return $this->connection->errno;
        }

        public function getLastRow ($table = 'us3477') {
            $sql = "SELECT * FROM $table ORDER BY id DESC LIMIT 1";
            $result = $this->connection->query($sql);
            $result = $result->fetch_object();

            if ($result) {
                $this->lastId = $result->id;
                $this->lastValue = $result->value;
            }

            return $this->connection->error;
        }

        public function createRow($value)
        {
            $sql = "INSERT INTO us3477 (value) VALUES ('$value')";
            $this->connection->query($sql);

            if($this->connection->errno) {
                var_dump($this->connection->errno . " - ". $this->connection->error);
                die();
            }
        }

        public function getRow($id) {
            $sql = "SELECT * FROM us3477 WHERE id=$id";
            $result = $this->connection->query($sql);
            $result = $result->fetch_object();

            return $result;
        }
    }
    