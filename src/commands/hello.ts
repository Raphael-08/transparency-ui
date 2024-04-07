import { Command } from "commander";
import { renderTitle } from '../utils/renderTitle.js';



export const helloCommand = new Command()
.name("hello")
.description("Prints a greeting message")
.action(() => {
  renderTitle("hello");
});

