import {run, Context} from 'probot';

run((app) => {
  app.on([
    'pull_request.opened',
    'pull_request.reopened',
    'pull_request.synchronize', // Handle new commits & amends
  ], async (context: Context<'pull_request'>) => {
    const {owner, repo, pull_number} = context.pullRequest();
    const head_sha = context.payload.pull_request.head.sha;

    const checkRun = await context.octokit.checks.create({
      owner,
      repo,
      head_sha,
      name: 'test-required',
      status: 'in_progress',
    });

    await context.octokit.checks.update({
      owner,
      repo,
      head_sha,
      name: 'test-required',
      check_run_id: checkRun.data.id,
      completed_at: new Date().toISOString(),
      conclusion: 'failure',
      title: 'Something went wrong',
    });
  });

  app.onError(async (error) => {
    app.log.error(error);
  });
});
