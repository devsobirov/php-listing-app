<?php 
    class Database {
        public $connection;
        public $lastId;
        public $lastValue;

        public const HOST = '127.0.0.1';
        public const USERNAME = 'root';
        public const PASSWORD = 'root';
        public const DB_NAME = 'contest';

        public function __construct () {
            echo $this->HOST.
            $this->USERNAME.
            $this->PASSWORD. 
            $this->DB_NAME;
            $this->connection = $this->setConnection();
        }

        public function setConnection() 
        {
            
            return $this->connection = new mysqli(
                $this->HOST, 
                $this->USERNAME, 
                $this->PASSWORD, 
                $this->DB_NAME
            );
        }

        public function createTable($table) {
            $sql = "CREATE TABLE IF NOT EXIST $table  (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                value INT(6) NOT NULL
                )";
            $this->connection->query($sql);
            
            return $this->connection->errno;
        }

        public function getLastRow () {
            $sql = "";
            $this->connection->query($sql);

            $this->lastId = 1;
            $this->lastValue = 7;

            return $this->connection->error;
        }

        public function createRow($value)
        {
            // $sql = "";
            // $this->connection->query($sql);
            echo "Hello World";
        }

        public function getRow($id) {
            
        }
    }
    