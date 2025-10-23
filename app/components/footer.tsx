import { SocialIcon } from 'react-social-icons'

const socialLinks = [
  "https://facebook.com/pages/Electrifydc/115042054945476",
  "https://www.instagram.com/electrifyallhomes/",
  "https://www.linkedin.com/company/94257951",
  "https://x.com/ElectrifyDC",
  "https://www.youtube.com/@ElectrifyDC"
]

export default function Footer() {
  return (
    <footer className="md:flex justify-between text-center text-white bg-repower-dark-blue p-6">
        <div className="flex items-center justify-center md:justify-normal">
          {socialLinks.map((socialLink) => (
            <SocialIcon key={socialLink} target="_blank" url={socialLink} style={{ height: 40, width: 40 }} bgColor='#253551'/>
          ))}
        </div>
        <div className="flex items-center justify-center md:justify-end">
            <span className="align-middle mr-4">Powered by Electrify DC</span>
            <a href="https://electrifydc.org" target="_blank" rel="noopener noreferrer">
                <img src="img/electrifydmvwhitehorizontal.png" alt="Electrify DC" className="inline-block w-10 h-10" />
            </a>
        </div>
    </footer>
  );
}
  
  