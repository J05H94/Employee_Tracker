INSERT INTO department (department_name)
VALUES  ("IT"),
        ("Sales"),
        ("Customer Service"),
        ("Management");

INSERT INTO roles (title, salary, department_id) 
VALUES  ("Tech Support", 60000, 1),
        ("Network Builder", 65000, 1),
        ("Instalation Tech", 70000, 1),
        ("Outgoing", 40000, 2),
        ("Floor", 45000, 2),
        ("Customer Service Represinitive", 25000, 3),
        ("Cashier", 20000, 3),
        ("Stocker", 21000, 3),
        ("Customer Service Management", 30000, 4),
        ("Middle Management", 30000, 4),
        ("Upper Management", 30000, 4);

INSERT INTO employee (firstName, lastName, roles_id, manager_id)
VALUES  ("Upr", "Mangent", 11, null),
        ("Mid", "Mangent", 10, 1),
        ("Chris", "Sermgt", 9, 2),
        ("Josh", "Dawkins", 1, 1),
        ("Alex", "Shelfer", 8, 3),
        ("Bob", "Ringer", 7, 3),
        ("Charley", "Server", 6, 3),
        ("Dave", "Davidson", 5, 3),
        ("Evan", "Yeager", 4, 2),
        ("Frank", "Sonatra", 3, 2),
        ("George", "Lopez", 2, 2);