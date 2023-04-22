import { join } from 'path';
import htmlmin from 'htmlmin';
import fse from 'fs-extra';
import { exec } from 'child_process';
import fs from 'fs';

const root = process.cwd();
const dist = join(root, 'dist');
const assets = join(root, 'assets');

function deleteDist() {
  if (fse.pathExistsSync(dist)) {
    console.log('> deleteDist');
    fse.removeSync(dist);
  }
}

function copyAssets() {
  console.log('> copyAssets');
  fse.copySync(assets, join(dist, 'assets'));
}

function compileMD(callback) {
  console.log('> compileMD');
  exec('index-md', (error, stdout, stderr) => {
    if (error || stderr) {
      console.log('Failed to execute index-md');
    }
    if (error) {
      console.log(error.message);
      return;
    }
    if (stderr) {
      console.log(stderr);
      return;
    }
    console.log(stdout);
    if (callback) {
      callback();
    }
  });
}

function renderHTML() {
  console.log('> renderHTML');
  const htmlSource = join(dist, 'index.html');
  let html = fs.readFileSync(join(dist, 'index.html'), { encoding: 'utf-8' });
  html = htmlmin(html, { encoding: 'utf-8' });
  html = html.replace('{{ year }}', String(new Date().getFullYear()));
  fs.writeFileSync(htmlSource, html);
}

deleteDist();
copyAssets();
compileMD(renderHTML);
