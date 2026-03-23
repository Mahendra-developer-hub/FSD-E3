<?php
$conn = new mysqli("localhost", "root", "", "Task5_TransactionSystem");

if ($conn->connect_error) {
    die("Connection failed");
}

if(isset($_POST['pay'])) {

    $amount = $_POST['amount'];

    $conn->autocommit(FALSE);

    $deduct = "UPDATE accounts SET balance = balance - $amount WHERE name='User'";
    $add = "UPDATE accounts SET balance = balance + $amount WHERE name='Merchant'";

    if($conn->query($deduct) && $conn->query($add)) {
        $conn->commit();
        echo "Transaction Successful ✅";
    } else {
        $conn->rollback();
        echo "Transaction Failed ❌";
    }

    $conn->autocommit(TRUE);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Transaction System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<h2>Payment Simulation</h2>

<form method="post">
    <label>Enter Amount:</label>
    <input type="number" name="amount" required>
    <button type="submit" name="pay">Pay</button>
</form>

<br>

<h3>Account Balances</h3>

<?php
$result = mysqli_query($conn, "SELECT * FROM accounts");

while($row = mysqli_fetch_assoc($result)) {
    echo $row['name'] . " Balance: " . $row['balance'] . "<br>";
}

$conn->close();
?>

</body>
</html>
