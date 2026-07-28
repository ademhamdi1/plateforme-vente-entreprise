import psycopg2
import getpass

print("PostgreSQL Connection Tester")
print("=" * 40)

# Try common passwords
passwords_to_try = ['postgres', '', 'admin', 'root', '1234', '12345']

print("\nTrying common passwords...")
for pwd in passwords_to_try:
    try:
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password=pwd,
            host='localhost',
            port='5432'
        )
        print(f"✓ SUCCESS! Password is: '{pwd}'")
        
        # Try to change password
        print("\nChanging password to 'postgres'...")
        cur = conn.cursor()
        cur.execute("ALTER USER postgres WITH PASSWORD 'postgres';")
        conn.commit()
        cur.close()
        conn.close()
        print("✓ Password successfully changed to 'postgres'")
        break
    except psycopg2.OperationalError as e:
        if 'password authentication failed' in str(e):
            continue
        else:
            print(f"✗ Error: {e}")
            break
    except Exception as e:
        print(f"✗ Error: {e}")
        break
else:
    print("\n✗ Could not connect with common passwords.")
    print("\nPlease enter your PostgreSQL password:")
    manual_pwd = getpass.getpass("Password: ")
    
    try:
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password=manual_pwd,
            host='localhost',
            port='5432'
        )
        print("✓ Connection successful!")
        
        # Change password
        print("\nChanging password to 'postgres'...")
        cur = conn.cursor()
        cur.execute("ALTER USER postgres WITH PASSWORD 'postgres';")
        conn.commit()
        cur.close()
        conn.close()
        print("✓ Password successfully changed to 'postgres'")
    except Exception as e:
        print(f"✗ Error: {e}")
