    <?php 

    define('ROOT', __DIR__);
    define('ID', 'us3477');

    $db = null;
    $id = null;
    $value = null;
    $action = null;

    require_once ROOT . '/Database.php';

    if ( isset($_GET['action']) ) {
        $action = $_GET['action'];
    }

    function calculateNewValue($previousValue) {
        $squared = pow($previousValue, 2);
        $arrayOfNumbers = array_map('intval', str_split($squared));
        $newValue = array_sum($arrayOfNumbers) + 1;

        return $newValue;
    }

    if ($action === 'init') {
        $filesList = array_diff(scandir(ROOT), ['..', '.', '.git']);
        echo json_encode($filesList);
    }

    if ($action === 'listing') {
        $content = null;
        $fileName = trim($_GET['file']);
        if (file_exists(ROOT . "/$fileName")) {
            $content = file_get_contents(ROOT. "/$fileName");
        }

        echo json_encode(htmlspecialchars($content));
    }

    if ($action === 'prepare_for_create_rows') {
        $db = new Database;
        $error = $db->connection->errno;
        
        if (!$error) {
            $error = $db->getLastRow();
        } 
        
        if(!$error) {
            $id = $db->lastId;
            $value = $db->lastValue;
            $action = 'create_rows';
        } else {
            echo json_encode($db->connection->error);
        }
    }
    
    if ($action === 'create_rows') {

        if ($id && $id > 0 && $id < 1000001) {
            while($id < 1000001) {
                if ($id > 1) {
                    $value = calculateNewValue($value);
                }
                $db->createRow($value);
                $id++;
            }
        }

    }

    if ($action === 'get_row') {
        $db = new Database;
        $error = $db->connection->errno;

        $id = intval($_GET['id']);
        $id = ceil($id);

        $result = $db->getRow($id);

        echo json_encode($result);
    }

    if ($db) {
        $db->connection->close();
    }

?>