<?php
require_once 'config/db.php';

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "INSERT INTO customers (name, email, password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $name, $email, $password);

    if ($stmt->execute()) {
        $message = "Signup successful! You can login now.";
    } else {
        $message = "Error: Email already exists!";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Customer Signup</title>
    <link rel="stylesheet" href="css/customer.css">
</head>

<body>

<div class="container">
    <div class="card">

        <h2>Customer Signup</h2>

        <p class="success"><?php echo $message; ?></p>

        <form method="POST">
            <input type="text" name="name" placeholder="Name" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>

            <button type="submit">Signup</button>
        </form>

        <div class="links">
            <a href="customer_login.php">Already have account? Login</a>
        </div>

    </div>
</div>

</body>
</html>