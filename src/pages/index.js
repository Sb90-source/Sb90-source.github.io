import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons';
import {LINKS} from '../links';
import styles from './index.module.css';

function Icon({icon}) {
  const [w, h, , , d] = icon.icon;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d={d} />
    </svg>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const sprite = useBaseUrl('/img/sprite.svg');
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <main className={styles.hero}>
        <img className={styles.sprite} src={sprite} alt="Pixel-art van een retro computer" width="192" height="180" />
        <h1 className={styles.name}>{siteConfig.title}</h1>
        <p className={styles.tagline}>{siteConfig.tagline}</p>
        <nav className={styles.buttons} aria-label="Links">
          {LINKS.github && (
            <a className={`${styles.btn} ${styles.solid}`} href={LINKS.github} target="_blank" rel="noopener noreferrer">
              <Icon icon={faGithub} /> GitHub
            </a>
          )}
          {LINKS.linkedin && (
            <a className={styles.btn} href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
              <Icon icon={faLinkedin} /> LinkedIn
            </a>
          )}
          <Link className={styles.btn} to="/wiki">Wiki</Link>
          <Link className={styles.btn} to="/blog">Blog</Link>
        </nav>
      </main>
    </Layout>
  );
}
