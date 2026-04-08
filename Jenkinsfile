 pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Shreyas0310/e-voting-repo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }

        stage('Run Tests') {
            steps {
                echo "No tests yet"
            }
        }

        stage('Run App') {
            steps {
                sh 'python app.py'
            }
        }
    }
}
