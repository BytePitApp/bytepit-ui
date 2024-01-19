import random
import string
import time

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


URLS = {
    "login_page": "https://dev.bytepit.cloud/login",
    "login": "https://dev.bytepit.cloud/api/auth/login",
    "logout": "https://dev.bytepit.cloud/api/auth/logout",
    "register_page": "https://dev.bytepit.cloud/register",
    "register": "https://dev.bytepit.cloud/api/auth/register",
    "login_page_dev": "https://dev.bytepit.cloud/login",
    "login_dev": "https://dev.bytepit.cloud/api/auth/login",
    "create_problem": "https://dev.bytepit.cloud/api/organiser/create-problem",
    "problems": "https://dev.bytepit.cloud/api/problems",
}


def generate_random_string(length):
    return "".join(random.choice(string.ascii_lowercase) for i in range(length))


def generate_random_email():
    return f"{generate_random_string(7)}@example.com"


def wait_for_ajax_complete(driver):
    return driver.execute_script(
        "return (window.performance.getEntriesByType('resource').filter(resource => "
        "resource.name.includes('/api/admin/list-users')).length > 0)"
    )


def wait_for_api_response(driver, request_url):
    return driver.execute_script(
        f"return (window.performance.getEntriesByType('resource').filter(resource => "
        f"resource.name.includes('{request_url}'))[0])"
    )


def define_driver():
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")

    driver = webdriver.Chrome(options=chrome_options)

    return driver


def login(driver, username="sipa", password="blablabla", url=URLS["login_page"]):
    driver.get(url)

    username_input_field = driver.find_element("name", "username")
    password_input_field = driver.find_element("name", "password")
    submit_button = driver.find_element("xpath", '//span[text()="Submit"]')

    username_input_field.send_keys(username)
    password_input_field.send_keys(password)

    submit_button.click()


def login_dev(
    driver, username="sipa", password="blablabla", url=URLS["login_page_dev"]
):
    driver.get(url)

    username_input_field = driver.find_element("name", "username")
    password_input_field = driver.find_element("name", "password")
    submit_button = driver.find_element("xpath", '//span[text()="Submit"]')

    username_input_field.send_keys(username)
    password_input_field.send_keys(password)

    submit_button.click()


def register(
    driver,
    email="test@test.com",
    name="Test",
    username="testuser",
    surname="User",
    password="testpass",
    role="Contestant",
):
    driver.get(URLS["register_page"])

    dropdown = driver.find_element(By.ID, "role")
    dropdown.click()

    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//div[contains(@class, 'dropdown') and .//div[text()='Contestant']]",
            )
        )
    )
    role_option = driver.find_element(
        By.XPATH, "//div[contains(@class, 'dropdown') and .//div[text()='Contestant']]"
    )
    role_option.click()

    email_input_field = driver.find_element(By.NAME, "email")
    name_input_field = driver.find_element(By.NAME, "name")
    username_input_field = driver.find_element(By.NAME, "username")
    surname_input_field = driver.find_element(By.NAME, "surname")
    password_input_field = driver.find_element(By.NAME, "password")

    submit_button = driver.find_element(
        By.XPATH, "//button[.//span[contains(text(), 'Submit')]]"
    )

    email_input_field.send_keys(email)
    name_input_field.send_keys(name)
    username_input_field.send_keys(username)
    surname_input_field.send_keys(surname)
    password_input_field.send_keys(password)

    submit_button.click()


def test_login():
    driver = define_driver()
    login(driver)

    wait = WebDriverWait(driver, 30)

    api_response = wait.until(lambda d: wait_for_api_response(d, URLS["login"]))
    response_code = api_response["responseStatus"]

    if response_code == 200:
        print("TEST LOGIN: PASSED")
    else:
        print("TEST LOGIN: FAILED")

    driver.save_screenshot("test_screenshots/screenshot_test_result.png")

    driver.quit()


def test_login_with_wrong_credentials():
    driver = define_driver()
    login(driver, username="test", password="test")

    wait = WebDriverWait(driver, 60)

    api_response = wait.until(lambda d: wait_for_api_response(d, URLS["login"]))

    driver.save_screenshot("test_screenshots/failed_login.png")

    response_code = api_response["responseStatus"]

    if response_code == 401:
        print("TEST WRONG LOGIN CREDENTIALS: PASSED")
    else:
        print("TEST WRONG LOGIN CREDENTIALS: FAILED")

    driver.quit()


def test_logout():
    driver = define_driver()
    login(driver)

    wait = WebDriverWait(driver, 30)

    wait.until(lambda d: wait_for_api_response(d, URLS["login"]))

    time.sleep(5)
    logout_button = driver.find_element("xpath", '//span[text()="Logout"]')
    logout_button.click()

    api_response = wait.until(lambda d: wait_for_api_response(d, URLS["logout"]))

    if api_response["responseStatus"] == 200:
        driver.save_screenshot("test_screenshots/screen_after_logout.png")
    else:
        print("TEST LOGOUT: FAILED")

    if str(driver.current_url) == URLS["login_page"]:
        print("TEST LOGOUT: PASSED")
    else:
        print("TEST LOGOUT: FAILED")

    driver.quit()


def test_register_already_exists():
    driver = define_driver()
    register(
        driver,
        email="existinguser@example.com",
        name="Test",
        username="existinguser",
        surname="User",
        password="testpassword",
        role="Contestant",
    )
    wait = WebDriverWait(driver, 10)
    api_response = wait.until(lambda d: wait_for_api_response(d, URLS["register"]))
    driver.save_screenshot(
        "test_screenshots/registration_already_exists_test_result.png"
    )

    if api_response["responseStatus"] == 400:
        print("TEST REGISTER ALREADY EXISTS: PASSED")
    else:
        print(
            "TEST REGISTER ALREADY EXISTS: FAILED - Unexpected Response Status:",
            api_response["responseStatus"],
        )

    driver.quit()


def test_register_new_user():
    driver = define_driver()
    attempt_count = 3

    for attempt in range(attempt_count):
        try:
            random_username = generate_random_string(8)
            random_email = generate_random_email()
            register(
                driver,
                email=random_email,
                name="Test",
                username=random_username,
                surname="User",
                password="testpassword",
                role="Contestant",
            )
            wait = WebDriverWait(driver, 20)
            api_response = wait.until(
                lambda d: wait_for_api_response(d, URLS["register"])
            )
            driver.save_screenshot(
                "test_screenshots/registration_new_user_test_result.png"
            )

            if api_response["responseStatus"] == 201:
                print("TEST REGISTER NEW USER: PASSED")
                break
            else:
                print(
                    f'TEST REGISTER NEW USER: FAILED - Response Status: {api_response["responseStatus"]}'
                )
                if attempt < attempt_count - 1:
                    print("Retrying registration...")
                else:
                    print("All attempts failed.")

        except TimeoutException as e:
            print(
                f"TEST REGISTER NEW USER: ATTEMPT {attempt + 1} - Timeout Exception: {e}"
            )
            if attempt < attempt_count - 1:
                print("Retrying registration...")
            else:
                print("All attempts failed.")
        finally:
            driver.quit()


def main():
    test_login()
    test_login_with_wrong_credentials()
    test_logout()
    test_register_already_exists()
    test_register_new_user()


if __name__ == "__main__":
    main()
