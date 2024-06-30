<?php
// Configuración de conexión a la base de datos
$servername = "localhost"; // Cambiar si tu servidor MySQL está en otro lugar
$username = "root"; // Usuario de la base de datos
$password = ""; // Contraseña de la base de datos
$dbname = "monto_monetario"; // Nombre de la base de datos que has creado

// Establecer conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => "Conexión fallida: " . $conn->connect_error]));
}

// Manejar solicitudes GET y POST
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Consultar el monto actual más reciente
    $sql = "SELECT monto_actual FROM montos ORDER BY id DESC LIMIT 1";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['monto_actual' => $row['monto_actual']]);
    } else {
        echo json_encode(['monto_actual' => 0]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validar y sanitizar el monto recibido
    $monto = filter_var($_POST['monto'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

    // Verificar que el monto sea válido
    if (!is_numeric($monto) || $monto <= 0) {
        echo json_encode(['success' => false, 'error' => 'El monto proporcionado no es válido.']);
        exit;
    }

    // Insertar el nuevo monto en la base de datos usando una declaración preparada
    $stmt = $conn->prepare("INSERT INTO montos (monto_actual) VALUES (?)");
    $stmt->bind_param("d", $monto);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
    $stmt->close();
}

// Cerrar la conexión a la base de datos
$conn->close();
?>
