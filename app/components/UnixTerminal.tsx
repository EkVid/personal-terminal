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

    term.writeln(verticalPadding + `\x1b[1;32m\x1b[1m${paddedWelcome}\x1b[0m`);
    term.writeln(verticalPaddingHelp + `\x1b[1;32m${helpMsg}\x1b[0m`);
    term.write(verticalPaddingInput + `\x1b[1;32m$ \x1b[0m`);

    function handleCommand(input: any) {
      const args = input.trim().split(' ');
      const command = args[0];

      const colorStyle = '\x1b[38;5;39m'; // Greenish blue color
      const resetStyle = '\x1b[0m'; // Reset the color to default

      
      switch (command) {
        case 'help':
          term.writeln(`<span style="font-size: 20px; ${colorStyle}">Available commands: help, clear, echo <message></span>`);
          break;
        case 'clear':
          term.clear();
          break;
        case 'echo':
          term.writeln(`<span style="font-size: 20px; ${colorStyle}">${args.slice(1).join(' ')}</span>`);
          break;
        default:
          term.writeln(`<span style="font-size: 20px; ${colorStyle}">Command not found: ${command}</span>`);
      }
    }
    

    term.onKey(({ key, domEvent }) => {
      if (domEvent.key === 'Enter') {
        term.writeln('');
        handleCommand(currentInput);
        term.write(`\x1b[1;32m$ \x1b[0m`);
        currentInput = '';
      } else if (domEvent.key === 'Backspace') {
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        currentInput += key;
        term.write(`\x1b[1;32m${key}\x1b[0m`);
      }
    });

    return () => term.dispose();
  }, []);

  return <div ref={terminalRef} className="h-screen w-full bg-black" />;
}