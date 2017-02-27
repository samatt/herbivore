##Herbivore

###Getting Started

install: `npm install`

rebuild: `./node_modules/.bin/electron-rebuild` 

run: `npm run dev`

[Pre-release](https://github.com/samatt/herbivore/releases)

_Warning: Herbivore is in active development and the pre-release might be from a previous build_ 



###What is Herbivore?

<!-- When you run Herbivore on your computer it allows you to decipher network traffic and show you the  -->

Herbivore was created to make network traffic decipherable to humans and show which computers its in conversation with and why.

A packet inspection tool is software running on a computer that allows you to look at all the network traffic that is being sent and received on the network you are currently connected to. The range of activity this lets you monitor includes your browser traffic, your operating system sending bug reports, services like Dropbox and Spotify talking to their servers and content streaming to devices such as Apple Tvs and Sonos speakers, and your internet of things devices talking on the internet.

Herbivore is capable of listening to the traffic of other devices on your network too. If you have heard of Wireshark before you could think of it as Wireshark for humans.

###What does Herbivore listen for?

While Herbivore can technically listent to all of the information mentioned above, in this first version it is limited to picking up HTTP and HTTPS traffic. This was done to prevent the activity you are seeing from feeling overwhelming. Often a lot of the traffic on the network is not human readable (for example it is hard to tell that a packet is transmitting a small part of a song being streamed on your speakers by looking at it). The nice thing about the HTTP protocol is that it lets us pay attention to the things our computer is requesting from the server rather than the content itself. An example of this is when you go to a page with an image on it. The request for the image is typically made using an HTTP GET request, we are more interested in this request than the actual image itself.

For the more technical crowd all this means is that Herbivore is filtering for TCP packets on port 80 and 443.


###Herbivore is NOT a tool for "hacking"

While a lot of the stuff Herbivore does under the hood is nowadays often branded as hacking, Herbivore is NOT a hacking tool. One of the assumptions this tool seeks to challenge is that the only people interested in poking around their networks our system administrators, the IT community and hax0rs. The mainstreaming of this rhetoric is advantageous to those who would rather you dont pay attention to your network activity. These actors include but arent limited to governements, ad companies, networked device manufacturers, malware creators and other forms of spammers.

We explicitly reject this notion and believe that everyone should be allowed to experiment with their own private networks. Fundamentally, we believe that for the majority of people understanding how systems break doenst mean you go around trying to break them but rather helps you better understand how to protect yourself and those around you.

###HTTP vs HTTPS

HTTPS is the encrypted version of the HTTP protocol. The common analogy used to explain the difference between the two is the difference between a postcard and a sealed envelope being sent through the mail. HTTP is the postcard, every device that packet is transmitted through on the network can see all the contents of that packet. HTTPS is like a sealed envelope, while you can see where the message is headed you cannot see what it contains. 

Herbivore is designed to make it easy for you to see all the your traffic and determine what data is being sent securely vs insecurely. While you typically get this feedback from modern browsers, a situation where this is useful is  when a website you go to is loaded through HTTPS but some of the content being loaded on the website is HTTP.
