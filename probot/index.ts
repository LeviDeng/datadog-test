import {run, Context} from 'probot';

// const CHECK_NAME = 'test-required';
// const CHECK_NAME = 'test-required-a';
// const CHECK_NAME = 'test-required-b';
const CHECK_NAME = 'test-required-c';

run((app) => {
  app.on([
    'pull_request.opened',
    'pull_request.reopened',
    'pull_request.synchronize', // Handle new commits & amends
  ], async (context: Context<'pull_request'>) => {
    const {owner, repo} = context.pullRequest();
    const head_sha = context.payload.pull_request.head.sha;

    app.log.info(context.payload);

    const checkRun = await context.octokit.checks.create({
      owner,
      repo,
      head_sha,
      name: CHECK_NAME,
      status: 'in_progress',
    });

    const output = {
      title: 'Schema Invalid',
      summary: `Errors occurred when validating the catalog file:`
    }
    await context.octokit.checks.update({
      owner,
      repo,
      head_sha,
      name: CHECK_NAME,
      check_run_id: checkRun.data.id,
      completed_at: new Date().toISOString(),
      conclusion: 'failure',
      ...output,
    });
  });

  app.onError(async (error) => {
    app.log.error(error);
  });
});
