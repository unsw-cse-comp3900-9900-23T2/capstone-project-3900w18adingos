# Eatery Management System


## Installation Guide

### Run with Docker

1. **Download Docker**: Download the latest build of Docker from their website: [https://www.docker.com/](https://www.docker.com/). Once downloaded, follow their instructions to install successfully. Ensure it’s installed properly by running the following command in a terminal:

    ```bash
    docker -v
    ```

2. **Run Docker**: From the root directory of the project, run the following command in a terminal:

    ```bash
    docker-compose up --force-recreate --build
    ```

    This will build the Docker image and start up the Docker container, which will run the application. The application is available at [http://localhost:80/](http://localhost:80/)

### Ngrok User Guide 

Use this guide to check how the QR scan would work on the phone:

1. **Run Docker**: Run Docker as usual.

2. **Run ngrok**: In a new terminal run:

    ```bash
    ngrok http --domain=ems.ngrok.app --region=au  80
    ```

3. **Copy the Link**: Copy the generated link. It will generate the custom domain for our project, for example: [https://ems.ngrok.app/](https://ems.ngrok.app/).

4. **Update Context Files**: Paste the copied link into `baseurl` in all the context files. This bit of code specifically:

    ```javascript
    const api = axios.create({
      baseURL: "http://127.0.0.1:5000",
    });
    ```

    should now be:

    ```javascript
      const api = axios.create({
        baseURL: "https://ems.ngrok.app",
      });
    ```

5. **Restart Docker**: End the currently running Docker process and re-run Docker. Now you can just use that ngrok link.




### Run without Docker

1. **Install Python and NodeJS**: Ensure you have the latest versions of Python and NodeJS installed on your machine.

2. **Set up the Frontend**: From a terminal, run the following commands from the root directory:

    ```bash
    cd frontend
    npm i
    vite
    ```

    These commands will navigate to the frontend folder, install all required dependencies for the frontend, and run the frontend server in a development environment. If the final command does not run, use this alternative command:

    ```bash
    npm run dev
    ```

3. **Set up the Backend**: To set up and run the backend, run the following commands from the root directory:

    ```bash
    cd backend
    python -m venv venv
    ```

    This will navigate to the backend directory and create a Python virtual environment to run the project in. Then, for macOS or Linux, run:

    ```bash
    source venv/bin/activate
    ```

    Or for Windows, run:

    ```bash
    .\venv\Scripts\activate
    ```

    This will activate the virtual environment created in the previous step.

4. **Install Dependencies**: Run the following command to install all Python dependencies required to run the application:

    ```bash
    pip install -r requirements.txt
    ```

5. **Run the Backend Server**: Finally, to run the backend Flask server, run this command from the backend directory:

    ```bash
    python wsgi.py
    ```

    The frontend is accessible at [http://localhost:5173/](http://localhost:5173/).

