pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile.build'
      dir 'build'
      additionalBuildArgs '--build-arg DOCKER_GID=$(getent group docker | awk -F: \'{ print $3}\')'
      args '-u node -v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

  environment {
    MASTER_BRANCH_NAME = "origin/master"
    JENKINS_RELEASE_TAG = "${env.BUILD_NUMBER}-"
  }

  stages {
    stage('Release tag preparation') {
      steps {
        script {
          switch(env.GIT_BRANCH) {
            case "origin/develop":
              JENKINS_RELEASE_TAG = "${JENKINS_RELEASE_TAG}dev"
            break
            case MASTER_BRANCH_NAME:
              JENKINS_RELEASE_TAG = "${JENKINS_RELEASE_TAG}prod"
            break
            default:
              JENKINS_RELEASE_TAG = "${JENKINS_RELEASE_TAG}snapshot"
            break;
          }
        }
      }
    }
    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }
    stage('Build and lint') {
      parallel {
        stage('Build dist package') {
          steps {
            sh 'npm run build'
          }
        }
      }
    }
    stage('Unit Test') {
      steps {
        sh 'npm run test'
      }
      post {
        always {
          junit 'reports/report.xml'
          step([$class: 'CoberturaPublisher', coberturaReportFile: 'coverage/cobertura-coverage.xml'])
        }
      }
    }
    stage('End to End Test') {
      steps {
        withEnv(readFile('test.jenkins.env').split('\n') as List) {
          sh 'npm run test:e2e'
        }
      }
      post {
        always {
          junit 'reports/report.xml'
          step([$class: 'CoberturaPublisher', coberturaReportFile: 'coverage/cobertura-coverage.xml'])
        }
      }
    }
    stage('Build release [old]') {
      when {
        environment name: 'GIT_BRANCH', value: 'origin/develop'
        environment name: 'JENKINS_DEPRECATED', value: '1'
      }
      steps {
        script {
          docker.build("web-scrapper:${JENKINS_RELEASE_TAG}", '-f build/Dockerfile .')
        }
      }
    }
    stage('Build release') {
      when {
        anyOf {
          environment name: 'GIT_BRANCH', value: 'origin/develop'
          environment name: 'GIT_BRANCH', value: MASTER_BRANCH_NAME
        }
        not {
          environment name: 'JENKINS_DEPRECATED', value: '1'
        }
      }
      steps {
        script {
          withAWS(credentials: 'aws-deploy-dev', region: 'eu-central-1') {
            AWS_ACCOUNT_ID = awsIdentity().account
            docker_image = docker.build("web-scrapper", '-f Dockerfile .')
            docker.withRegistry("https://${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com", "ecr:${AWS_DEFAULT_REGION}:aws-deploy-dev") {
              docker_image.push("${JENKINS_RELEASE_TAG}")
              docker_image.push("latest")
            }
          }
        }
      }
    }
  }
  post {
    success {
      script {
        if (env.GIT_BRANCH == 'origin/develop') {
          build (
            wait: false,
            job: 'Backend Deployment',
            parameters: [string(name: 'DEPLOY_ENV', value: 'DEV'), string(name: 'DEPLOY_VERSION', value: "${JENKINS_RELEASE_TAG}")],
          )
        }
        else if (env.GIT_BRANCH == MASTER_BRANCH_NAME) {
          build (
            wait: false,
            job: 'Backend Deployment',
            parameters: [string(name: 'DEPLOY_ENV', value: 'PROD'), string(name: 'DEPLOY_VERSION', value: "${JENKINS_RELEASE_TAG}")],
          )
        }
      }
    }
    failure {
      script {
        if (env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == MASTER_BRANCH_NAME) {
          slackSend (message: "Build failed: ${env.JOB_NAME}, branch develop (<${env.BUILD_URL}|Open>)", color: "danger")
        }
      }
    }
    fixed {
      script {
        if (env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == MASTER_BRANCH_NAME) {
          slackSend (message: "Build repaired: ${env.JOB_NAME}, branch develop (<${env.BUILD_URL}|Open>)", color: "good")
        }
      }
    }
  }
}
