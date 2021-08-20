    <?php 

    const ROOT = __DIR__;
    const ID = 'us3477';
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
        $filesList = array_diff(scandir(ROOT), ['..', '.']);
        echo json_encode($filesList);
    }

    if ($action === 'listing') {
        $content = null;
        $fileName = trim($_GET['file']);
        if (file_exists(ROOT . "/$fileName")) {
            $content = file_get_contents(ROOT. "/$fileName");
        }

        echo json_encode(htmlspecialchars($content));
        //echo json_encode(nl2br(htmlspecialchars($content)));
    }

    if ($action === 'init_db') {
        $error = null;
        $db = new Database;
        $db->setConnection();
        
        var_dump($db);
        die($db->error);
        if (!$error) {
            $error = $db->createTable(ID);
            $action = 'create_rows';
        } else {
            echo json_encode($error);
        }
    }
    
    if ($action === 'create_rows') {

        $error = $db->getLastRow();
        if (!$error) { 
            $id = $db->lastId;
            $value = $db->lastValue;
        }

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
        $id = $_GET['id'];
        $result = $db->getRow($id);

        echo json_encode($result);
    }

?>