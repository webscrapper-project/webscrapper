import {Job} from "../model/job.schema";
import {JobResponseDto} from "../dto/job-response.dto";

export const jobSchemaToJobDtoMapper = (job: Job): JobResponseDto => {
    const jobDto = new JobResponseDto();

    jobDto.url = job.url;
    jobDto.status = job.status;
    jobDto.id = job._id;

    return jobDto;
}
