#!/usr/bin/env groovy

library identifier: 'apm@current',
retriever: modernSCM(
  [$class: 'GitSCMSource',
  credentialsId: 'f94e9298-83ae-417e-ba91-85c279771570',
  id: '37cf2c00-2cc7-482e-8c62-7bbffef475e2',
  remote: 'git@github.com:elastic/apm-pipeline-library.git'])

pipeline {
  agent { label 'linux && immutable' }
  environment {
    BASE_DIR = 'src/github.com/elastic/kibana'
    HOME = "${env.WORKSPACE}"
    E2E_DIR = 'x-pack/legacy/plugins/apm/e2e'
    PIPELINE_LOG_LEVEL = 'DEBUG'
  }
  options {
    timeout(time: 1, unit: 'HOURS')
    buildDiscarder(logRotator(numToKeepStr: '40', artifactNumToKeepStr: '20', daysToKeepStr: '30'))
    timestamps()
    ansiColor('xterm')
    disableResume()
    durabilityHint('PERFORMANCE_OPTIMIZED')
  }
  triggers {
    issueCommentTrigger('(?i)(retest|.*jenkins\\W+run\\W+(?:the\\W+)?e2e?.*)')
  }
  parameters {
    booleanParam(name: 'FORCE', defaultValue: false, description: 'Whether to force the run.')
  }
  stages {
    stage('Checkout') {
      options { skipDefaultCheckout() }
      steps {
        deleteDir()
        gitCheckout(basedir: "${BASE_DIR}", githubNotifyFirstTimeContributor: false,
                    shallow: false, reference: "/var/lib/jenkins/.git-references/kibana.git")
        script {
          dir("${BASE_DIR}"){
            def regexps =[ "^x-pack/legacy/plugins/apm/.*" ]
            env.APM_UPDATED = isGitRegionMatch(patterns: regexps)
          }
        }
      }
    }
    stage('Prepare Kibana') {
      options { skipDefaultCheckout() }
      when {
        anyOf {
          expression { return params.FORCE }
          expression { return env.APM_UPDATED != "false" }
        }
      }
      environment {
        JENKINS_NODE_COOKIE = 'dontKillMe'
      }
      steps {
        notifyStatus('Preparing kibana', 'PENDING')
        dir("${BASE_DIR}"){
          sh script: "${E2E_DIR}/ci/prepare-kibana.sh"
        }
      }
      post {
        unsuccessful {
          notifyStatus('Kibana warm up failed', 'FAILURE')
        }
      }
    }
    stage('Smoke Tests'){
      options { skipDefaultCheckout() }
      when {
        anyOf {
          expression { return params.FORCE }
          expression { return env.APM_UPDATED != "false" }
        }
      }
      steps{
        notifyStatus('Running smoke tests', 'PENDING')
        dir("${BASE_DIR}"){
          sh "${E2E_DIR}/run-e2e.sh"
        }
      }
      post {
        always {
          dir("${BASE_DIR}"){
            archiveArtifacts(allowEmptyArchive: false, artifacts: "${E2E_DIR}/**/screenshots/**,${E2E_DIR}/**/videos/**,${E2E_DIR}/**/test-results/*e2e-tests.xml")
            junit(allowEmptyResults: true, testResults: "${E2E_DIR}/**/test-results/*e2e-tests.xml")
            dir('./tmp/apm-integration-testing'){
              sh 'docker-compose logs > apm-its-docker.log || true'
              sh 'docker-compose down -v || true'
              archiveArtifacts(allowEmptyArchive: true, artifacts: 'apm-its-docker.log')
            }
          }
        }
        unsuccessful {
          notifyStatus('Test failures', 'FAILURE')
        }
        success {
          notifyStatus('Tests passed', 'SUCCESS')
        }
      }
    }
  }
  post {
    always {
      dir("${BASE_DIR}"){
        archiveArtifacts(allowEmptyArchive: true, artifacts: 'kibana.log,./tmp/*.log')
      }
    }
  }
}

def notifyStatus(String description, String status) {
  withGithubNotify.notify('end2end-for-apm-ui', description, status, getBlueoceanDisplayURL())
}
