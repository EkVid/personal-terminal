'use client';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';


const UnixTerminal = () => {
  const terminalRef = useRef(null);
  let currentInput = '';
  let chatAttempts = 0; 

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
    const helpMsg = 'Type `ls` to see available commands.';
    const additionalMsg = '====== This is a terminal version of my website designed for those who preferred to talk to computers rather than click around 🙂 =======';
    const additionalMsg2 = '======= If you want to learn about me in a more visually appealing way, type `sure` below ========';
    const padding = Math.max(0, Math.floor((cols - welcomeMsg.length) / 2));
    const verticalPadding = '\n'.repeat(3); // margin top
    const verticalPaddingHelp = '\n'.repeat(2);
    const verticalPaddingInput = '\n'.repeat(1);
    const paddedWelcome = ' '.repeat(padding) + welcomeMsg;

    const centerMessage = (msg: any) => {
      const padding = Math.max(0, Math.floor((cols - msg.length) / 2));
      return ' '.repeat(padding) + msg;
    };
    
    // Centered and dimmed messages
    const dimStyle = '\x1b[38;5;245m'; // Dim text for smaller effect
    const resetStyle = '\x1b[0m';
    

    // Function to display the welcome message and the initial prompt
    const displayWelcome = () => {
      term.writeln(verticalPadding + `\x1b[1;32m\x1b[1m${paddedWelcome}\x1b[0m`);
      term.writeln(verticalPaddingHelp + `${dimStyle}${centerMessage(additionalMsg)}${resetStyle}`);
      term.writeln(verticalPaddingHelp + `${dimStyle}${centerMessage(additionalMsg2)}${resetStyle}`);
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

        case 'sure':
          window.open('https://austinyt.in', '_blank');
          term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}Well you are back, then I assume you prefer to talk to computers :)${resetStyle}`);
          term.writeln(verticalPadding);
          term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}JK, hope you have fun :)${resetStyle}`);
          term.writeln(verticalPadding);
          term.write(`\x1b[1;32m$ \x1b[0m`);

          break;
 
        case 'help':
          term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}Welcome to the Ultra Mega Super Secret Terminal (I don't remember I listed this option under ls), where nothing is as it seems (but don't worry, it's mostly harmless). If you need assistance, you're in the right place! 🌟 Here's what you can do... (spoiler: it’s not much, but it's fun!)${resetStyle}`);
          term.writeln(verticalPadding);
        case 'ls':
          // Table structure for commands with a box around it
          const table = [
            ['about', 'Something About Me'],
            ['links', 'Links to my other portfolios'],
            ['res', 'My Resume'],
            ['clear', 'Clear the terminal screen'],
            ['chat', 'Just want to chat with someone or is it actually someone?'],
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

        case 'about':

          const argTable = [
            ['-w', 'Internship Work Experience'],
            ['-pub', 'Publications'],
            ['-pro', 'Projects']
          ];

          const workTable = [
            ['Software Developer', 'RBC', 'Toronto, CA', 'May 2025 - Aug 2025'],
            ['Full Stack Developer', 'OMERS', 'Toronto, CA', 'Jan 2025 - Apr 2025'],
            ['Software Developer', 'CIBC', 'Toronto, CA', 'Jun 2024 - Dec 2024'],
            ['Software Engineer', 'Geotab', 'Oakville, CA', 'Jan 2024 - Apr 2024'],
            ['Quantitative Analyst', 'MIZUHO', 'Tokyo, JP', 'May 2022 - Aug 2022'],
            ['Full Stack Developer', 'TOYOTA Motor Corportaion', 'Tokyo, JP', 'May 2021 - Aug 2021']
          ];

          const publicationTable = [
            ['Competitive Dynamics Between 2 Bird Species', 'Austin Yang, Chiung Joyce Wu', '2024'],
            ['Impact of Covid on CS Education', 'Dr. Brian Harrington, Austin Yang, et al', '2023-2024'],
            ['Coronavirus Detection using photonics', 'Akshat Modi, Austin Yang, Akriti Sharma', '2022-2023']
          ];
     

          if(args.length === 1){
            term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}Just a bit about myself! I'm Austin Yang, a 4th year Computer Science, Statistics, and Biology student at the University of Toronto. I have had the opportunity to explore my interests in various fields through academic coursework, research, and industry experience. Throughout my CS & Stats journey, I have learned different programming languages, and developed a strong foundation in algorithms, data structures, and software engineering. Whereas in my Biology studies, I have gained knowledge about the structure and function of biological systems, and have conducted research on topics such as protein folding and metabolism. As I move forward in my academic and professional journey, I also developed an interest in modern world finance, and I am excited to continue exploring the intersections between computer science and these different fields, and to use my skills to link these subjects together. As of right now, my interest lies in Financial Technology and Quantitative Development, where you use mathematical models, computational techniques, and statistical analysis to succeed in the financial domain.${resetStyle}`);

            term.writeln('\n');

            term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}Here is a list of other arguments you can append to about:${resetStyle}`);
            term.writeln('\n');
            
            term.writeln(`${lightBlueColor}+----------+------------------------------------------------+${resetStyle}`);
            term.writeln(`${lightBlueColor}| Argument | Description                                    |${resetStyle}`);
            term.writeln(`${lightBlueColor}+----------+------------------------------------------------+${resetStyle}`);

            argTable.forEach((row) => {
              const [arg, description] = row;
              const argFormatted = arg.padEnd(10); // Pad argument to be consistent
              const descriptionFormatted = description.padEnd(44); // Pad description to be consistent
              term.writeln(`${lightBlueColor}| ${argFormatted} | ${descriptionFormatted} |${resetStyle}`);
            });

            term.writeln(`${lightBlueColor}+----------+------------------------------------------------+${resetStyle}`);
            term.writeln('\n');

            term.write(`\x1b[1;32m$ \x1b[0m`);
            
            break;
          }
          else if (args[1] === '-w'){
            const aboutArg = args[1];

            if(args[0] == 'about'){
               // Table for work experience
            term.writeln(`${lightBlueColor}${boldStyle}\nWork Experience:${resetStyle}`);
            term.writeln(`${lightBlueColor}+------------------------+----------------------------+-------------------+--------------------------+${resetStyle}`);
            term.writeln(`${lightBlueColor}| Role                   | Company                    | Location          | Duration                 |${resetStyle}`);
            term.writeln(`${lightBlueColor}+------------------------+----------------------------+-------------------+--------------------------+${resetStyle}`);
            workTable.forEach((row) => {
              const [role, company, location, duration] = row;
              const roleFormatted = role.padEnd(22); // Pad role to be consistent
              const companyFormatted = company.padEnd(26); // Pad company to be consistent
              const locationFormatted = location.padEnd(17); // Pad location to be consistent
              const durationFormatted = duration.padEnd(22); // Pad duration to be consistent
              term.writeln(`${lightBlueColor}| ${roleFormatted} | ${companyFormatted} | ${locationFormatted} | ${durationFormatted}   |${resetStyle}`);
            });
            term.writeln(`${lightBlueColor}+------------------------+----------------------------+-------------------+--------------------------+${resetStyle}`);
            
            term.writeln('\n');
            term.write(`\x1b[1;32m$ \x1b[0m`);
            }

            break;
          }
          else if(args[1] === '-pub'){
            const aboutArg = args[1];

            if(args[0] == 'about'){
              term.writeln(`${lightBlueColor}${boldStyle}\nPublications:${resetStyle}`);
              term.writeln(`${lightBlueColor}+------------------------------------------------------+--------------------------------------------+---------------------+${resetStyle}`);
              term.writeln(`${lightBlueColor}| Title                                                | Author                                     | Year                |${resetStyle}`);
              term.writeln(`${lightBlueColor}+------------------------------------------------------+--------------------------------------------+---------------------+${resetStyle}`);
              publicationTable.forEach((row) => {
                const [title, author, year] = row;
                const titleFormatted = title.padEnd(54); // Pad title to be consistent
                const authorFormatted = author.padEnd(40); // Pad author to be consistent
                const yearFormatted = year.padEnd(20); // Pad year to be consistent
                term.writeln(`${lightBlueColor}|${titleFormatted}|${authorFormatted}    | ${yearFormatted}|${resetStyle}`);
              });
              term.writeln(`${lightBlueColor}+------------------------------------------------------+--------------------------------------------+---------------------+${resetStyle}`);
              term.writeln('\n');
              term.write(`\x1b[1;32m$ \x1b[0m`);
              break;
            }
          }
          else if(args[1] === '-pro'){
            term.writeln(`${lightBlueColor}${boldStyle}\nWhy bother to have another section for project when I can just show you my Github :)${resetStyle}`);
            window.open('https://github.com/EkVid/', '_blank');
            term.writeln('\n');
            term.write(`\x1b[1;32m$ \x1b[0m`);
            break;
          }
          else{
            term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}Invalid about option: ${args[1]}${resetStyle}`);
            term.writeln('\n');
            term.write(`\x1b[1;32m$ \x1b[0m`);
            break;
          }
          case 'links':
            const linksTable = [
              ['LinkedIn', 'https://www.linkedin.com/in/austin-yang-3544061ba/'],
              ['GitHub', 'https://github.com/EkVid/'],
              ['Personal Website', 'https://austinyt.in'],
            ];
              if (args.length === 1) {
              term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}Links to my other portfolios:${resetStyle}`);
              term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}\`links -number\` will redirect to the web page, where 'number' represents the order of the links. Ex: \`links -1\` for LinkedIn.${resetStyle}`);
              term.writeln(verticalPadding);

              // Draw top border for links table
              const topBorderLinks = `+${'-'.repeat(cols - 2)}+`;
              term.writeln(`${lightBlueColor}${topBorderLinks}${resetStyle}`);
  
              // Display links in a structured way
              linksTable.forEach((row, index) => {
                const [linkName, url] = row;
  
                // Center the link name and URL
                const linkFormatted = linkName.padEnd(20); // Link name column width (20 characters)
                const urlFormatted = url
                  .padStart(Math.floor((cols - 2 - linkFormatted.length) / 2) + url.length)
                  .padEnd(cols - 2 - linkFormatted.length); // Center the URL
  
                term.writeln(`${lightBlueColor}|${linkFormatted}${urlFormatted}|${resetStyle}`);
              });
  
              // Draw bottom border for links table
              const bottomBorderLinks = `+${'-'.repeat(cols - 2)}+`;
              term.writeln(`${lightBlueColor}${bottomBorderLinks}${resetStyle}`);
            } else {
              // Handle link selection with -1, -2, or -3
              const linkArg = args[1];
  
              switch (linkArg) {
                case '-1': // LinkedIn
                  term.writeln(`${verticalPadding}${lightBlueColor}Opened LinkedIn: https://www.linkedin.com/in/austin-yang-3544061ba/${resetStyle}`);
                  window.open('https://www.linkedin.com/in/austin-yang-3544061ba/', '_blank');
                  break;
                case '-2': // GitHub
                  term.writeln(`${verticalPadding}${lightBlueColor}Opened GitHub: https://github.com/EkVid/${resetStyle}`);
                  window.open('https://github.com/EkVid/', '_blank');
                  break;
                case '-3': // personal web
                  term.writeln(`${verticalPadding}${lightBlueColor}Opened Personal Website: https://austinyt.in${resetStyle}`);
                  window.open("https://austinyt.in", '_blank');
                  break;
                default:
                  term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}Invalid link option: ${linkArg}${resetStyle}`);
                  break;
              }
            }
            term.write(`\n\n`);
            term.write(`\x1b[1;32m$ \x1b[0m`);
            break;  
        
        case 'res':
          window.open('https://austinyt.in/resume.pdf', '_blank');
          term.writeln(`${verticalPadding}${lightBlueColor}Redirected to Resume Page${resetStyle}`);
          term.writeln('\n');
          term.write(`\x1b[1;32m$ \x1b[0m`);
          break;
  
        case 'clear':
          term.clear();
          displayWelcome();
          break;

        case 'chat':
          const asciiArt = [`(o^.^)`, `(°///°)`, `¯\_(ツ)_/¯`];

          chatAttempts++; // Increment the chat attempt counter

          if(chatAttempts === 1){
            term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}${asciiArt[0]}: "Server busy, please try again!"${resetStyle}`);
            term.writeln('\n');
            term.write(`\x1b[1;32m$ \x1b[0m`);
          }
          else if(chatAttempts === 2){
            term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}${asciiArt[1]}: "Server still busy, please try later!"${resetStyle}`);
            term.writeln('\n');
            term.write(`\x1b[1;32m$ \x1b[0m`);
          }
          else if(chatAttempts === 3){
            term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}${asciiArt[2]}: "I said server busy! Go check something else!"${resetStyle}`);
            term.writeln('\n');
            term.write(`\x1b[1;32m$ \x1b[0m`);
          }
          else if(chatAttempts === 6){
            term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}${asciiArt[2]}: "Okay enough, why not check this site out: https://chatgpt.com/"${resetStyle}`);
            term.writeln('\n');
            term.write(`\x1b[1;32m$ \x1b[0m`);
          }
          else if(chatAttempts === 7){
            window.open("https://chatgpt.com/", '_blank');
            term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}${asciiArt[2]}: "I already took you there, now stop doing chat"${resetStyle}`);
            term.writeln('\n');
            term.write(`\x1b[1;32m$ \x1b[0m`);
          }
          else{
            term.writeln(`${verticalPadding}${lightBlueColor}${boldStyle}Silence...${resetStyle}`);
            term.writeln('\n');
            term.write(`\x1b[1;32m$ \x1b[0m`);
          }
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

export default dynamic(() => Promise.resolve(UnixTerminal), { ssr: false });