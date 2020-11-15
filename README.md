# Schedule Provider

Provides a student or teacher's schedule

[![pipeline status](https://gitlab.com/medienportal/schedule-provider/badges/master/pipeline.svg)](https://gitlab.com/medienportal/schedule-provider/commits/master)
[![coverage report](https://gitlab.com/medienportal/schedule-provider/badges/master/coverage.svg)](https://gitlab.com/medienportal/schedule-provider/commits/master)

This project aims at gathering scheduling informations for different schools
from different services in order to provide a uniformed API access.

It has been designed for and with the needs of the [lotta](https://lotta.schule)
software for schools in mind.

## Currently supported Platforms

- Only [Indiware](https://indiware.de/) is supported yet.

## Output

See [ScheduleResult.ts interface](https://gitlab.com/medienportal/schedule-provider/-/blob/develop/src/model/ScheduleResult.ts)
for more information on the output format

## Usage

- Start the project with `docker-compose up`
- Access the API like this: `curl http://localhost:3000/schedule.json?class=(11)&password=(PASSWORD)&schoolId=(SCHOOL_ID)&source=(IndiwareStudent|IndiwareTeacher)&username=(USERNAME)&date=(YYYYMMDD)`
