'use client';
import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';

export default function UnixTerminal() {
  const terminalRef = useRef(null);
  let currentInput = '';

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: 'Courier New, monospace',
      fontSize: 20,
      theme: {
        background: '#000000',
        foreground: '#00FF00',
      },
      scrollback: 1000, // Disable scrollback buffer to prevent scrolling up or down
      disableStdin: false, // Allow user input, but restrict scrolling
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    const cols = term.cols;
    const welcomeMsg = '===== Welcome to Austin\'s Personal Terminal! =====';
    const helpMsg = 'Type `help` to see available commands.';
    const padding = Math.max(0, Math.floor((cols - welcomeMsg.length) / 2));
    const verticalPadding = '\n'.repeat(3); // margin top
    const verticalPaddingHelp = '\n'.repeat(2);
    const verticalPaddingInput = '\n'.repeat(1);
    const paddedWelcome = ' '.repeat(padding) + welcomeMsg;

    // Function to display the welcome message and the initial prompt
    const displayWelcome = () => {
      term.writeln(verticalPadding + `\x1b[1;32m\x1b[1m${paddedWelcome}\x1b[0m`);
      term.writeln(verticalPaddingHelp + `\x1b[1;32m${helpMsg}\x1b[0m`);
      term.write(verticalPaddingInput + `\x1b[1;32m$ \x1b[0m`);
    };

    // Initial welcome message and prompt display
    displayWelcome();

    function handleCommand(input: any) {
      const args = input.trim().split(' ');
      const command = args[0];

      const lightBlueColor = '\x1b[38;5;39m'; // Light blue color (ANSI escape code)
      const boldStyle = '\x1b[1m'; // Bold text (ANSI escape code)
      const resetStyle = '\x1b[0m'; // Reset the styles to default
      const verticalPadding = '\n'; // Adjust this for vertical padding if needed

      switch (command) {
        case 'help':
          // Table structure for commands with a box around it
          const table = [
            ['Command', 'Description'],
            ['help', 'Display this help message'],
            ['clear', 'Clear the terminal screen'],
            ['echo <message>', 'Display the provided message in the terminal'],
          ];

          term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}Available Commands:${resetStyle}`);
          term.writeln(verticalPadding);

          // Draw top border
          const topBorder = `+${'-'.repeat(cols - 2)}+`;
          term.writeln(`${lightBlueColor}${topBorder}${resetStyle}`);

          // Display table in a structured way
          table.forEach((row) => {
            const [cmd, desc] = row;

            // Center the command and description
            const cmdFormatted = cmd.padEnd(20); // Command column width (20 characters)
            const descFormatted = desc
              .padStart(Math.floor((cols - 2 - cmdFormatted.length) / 2) + desc.length)
              .padEnd(cols - 2 - cmdFormatted.length); // Center the description

            term.writeln(`${lightBlueColor}|${cmdFormatted}${descFormatted}|${resetStyle}`);
          });

          // Draw bottom border
          const bottomBorder = `+${'-'.repeat(cols - 2)}+`;
          term.writeln(`${lightBlueColor}${bottomBorder}${resetStyle}`);
          term.write(`\n\n`);

          term.write(`\x1b[1;32m$ \x1b[0m`);
          break;
        case 'clear':
          term.clear();
          displayWelcome();
          break;
        case 'echo':
          term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}${args.slice(1).join(' ')}${verticalPadding}${resetStyle}`);
          term.write(`\x1b[1;32m$ \x1b[0m`);
          break;
        default:
          term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}Command not found: ${command}${verticalPadding}${resetStyle}`);
          term.write(`\x1b[1;32m$ \x1b[0m`);
      }
    }

    term.onKey(({ key, domEvent }) => {
      if (domEvent.key === 'Enter') {
        if (currentInput.trim() === '') {
          // If nothing is typed, just go to a new line with the prompt
          term.writeln('');
          term.write(`\x1b[1;32m$ \x1b[0m`); // Prompt line with $ after a new line
        } else {
          // Handle the command when there's input
          term.writeln('');
          handleCommand(currentInput);
        }
        currentInput = ''; // Reset the current input after Enter is pressed
      } else if (domEvent.key === 'Backspace') {
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1);
          term.write('\b \b');
        }
      } else if (domEvent.key === 'ArrowUp' || domEvent.key === 'ArrowDown') {
        // Prevent the up and down keys from doing anything
        domEvent.preventDefault();
      } else {
        currentInput += key;
        term.write(`\x1b[1;32m${key}\x1b[0m`);
      }
    });
    

    return () => term.dispose();
  }, []);

  return <div ref={terminalRef} className="h-screen w-full bg-black" />;
}
