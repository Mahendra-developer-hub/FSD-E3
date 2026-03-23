<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: index.html");
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
    <h2>Welcome <?php echo $_SESSION['username']; ?></h2>
    <p>Login Successful ✅</p>
    <a href="logout.php">Logout</a>
</div>

</body>
</html>
