import * as program from 'commander';
import { selectProject, getPackages, buildPackages } from './actions';

program.command('set').action(selectProject);

program.command('pkg').action(getPackages);

program.command('build').action(buildPackages);

program.parse(process.argv);
