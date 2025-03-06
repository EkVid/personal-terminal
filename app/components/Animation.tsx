export const Animation = (term: any, cols: number, rows: number) => {
    let interval: any;
    let timeout: any;
    const speed = 50; // Speed of the falling effect
  
    // Random character generator for the "hacker-style" effect
    const randomChar = () => {
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
      return chars.charAt(Math.floor(Math.random() * chars.length));
    };
  
    // Random starting position for each column
    let columnHeights: number[] = Array(cols).fill(0);
  
    // Loop to display falling characters
    const displayFallingText = () => {
      for (let x = 0; x < cols; x++) {
        const char = randomChar();
        const y = columnHeights[x];
  
        // Print the character at the calculated position
        term.write(`\x1b[${y + 1};${x + 1}H${char}`);
  
        // Update column height for the next iteration
        if (y + 1 < rows) {
          columnHeights[x] = y + 1;
        } else {
          columnHeights[x] = 0;
        }
      }
    };
  
    // Loop to clear characters from top to bottom
    const clearText = () => {
      for (let x = 0; x < cols; x++) {
        // Start clearing characters from top to bottom
        const y = columnHeights[x];
  
        // Clear the character at the calculated position
        term.write(`\x1b[${y + 1};${x + 1}H `); // Clear character
  
        // Update column height for the next iteration
        if (y > 0) {
          columnHeights[x] = y - 1;
        } else {
          columnHeights[x] = 0;
        }
      }
    };
  
    // Start the falling text effect
    interval = setInterval(displayFallingText, speed);
  
    // After 3 seconds, start clearing the text
    timeout = setTimeout(() => {
      clearInterval(interval); // Stop the falling effect
      interval = setInterval(clearText, speed); // Start the clearing effect
  
      // After clearing is complete, display the welcome message
      setTimeout(() => {
        clearInterval(interval); // Stop clearing
        term.clear();
        displayWelcomeAnim(term, cols); // Show the welcome message
      }, 2300); // Time to clear all text
  
    }, 2100); // Falling text lasts for 3 seconds
  
    return { interval, timeout };
  };
  
  
  export const centerMessage = (msg: string, cols: number) => {
    const padding = Math.max(0, Math.floor((cols - msg.length) / 2));
    return ' '.repeat(padding) + msg;
  };
  
  export const dimStyle = '\x1b[38;5;245m'; // Dim text effect
  export const resetStyle = '\x1b[0m'; // Reset styles
  
  export const displayWelcomeAnim = (term: any, cols: number) => {
    const welcomeMsg = '===== Welcome to Austin\'s Personal Terminal! =====';
    const helpMsg = 'Type `ls` to see available commands.';
    const additionalMsg = '====== This is a terminal version of my website designed for those who prefer talking to computers rather than clicking around 🙂 =======';
    const additionalMsg2 = '======= If you want to learn about me in a more visually appealing way, type `sure` below ========';
  
    const padding = Math.max(0, Math.floor((cols - welcomeMsg.length) / 2));
    const verticalPadding = '\n'.repeat(3); // margin top
    const verticalPaddingHelp = '\n'.repeat(2);
    const verticalPaddingInput = '\n'.repeat(1);
    const paddedWelcome = ' '.repeat(padding) + welcomeMsg;
  
    term.writeln(verticalPadding + `\x1b[1;32m\x1b[1m${paddedWelcome}\x1b[0m`);
    term.writeln(verticalPaddingHelp + `${dimStyle}${centerMessage(additionalMsg, cols)}${resetStyle}`);
    term.writeln(verticalPaddingHelp + `${dimStyle}${centerMessage(additionalMsg2, cols)}${resetStyle}`);
    term.writeln(verticalPaddingHelp + `\x1b[1;32m${helpMsg}\x1b[0m`);
    term.write(verticalPaddingInput + `\x1b[1;32m$ \x1b[0m`);
  };
  