import Image from 'next/image';
import { ContactButtons } from '~components/contact-links';
import { PresidentCharacter } from '~components/team-character';
import { NIGHT } from '~content/night';
import { CopyAddressButton } from '~features/night/CopyAddressButton';
import styles from '~features/night/night.module.css';

function DirectionsMap() {
  const [nearby, overnight] = NIGHT.parking.lots;

  return (
    <figure className={styles.map}>
      <svg viewBox="0 0 370 242" role="img" aria-labelledby="night-map-title">
        <title id="night-map-title">
          {`${NIGHT.venue.name}, ${NIGHT.station.name}, 공영주차장 두 곳의 위치를 표시한 약도`}
        </title>
        <g fill="none" stroke="#dbd5be" strokeLinecap="round">
          <path d="M82 -10 L65 97 L77 157 L115 250" strokeWidth="20" />
          <path d="M-10 154 H84 L374 131" strokeWidth="20" />
          <path d="M120 151 L113 111 L120 -10" strokeWidth="15" />
          <path d="M115 68 L247 64 L319 34" strokeWidth="13" />
        </g>
        <g fill="#4c5647" fontSize="11">
          <text x="130" y="36">
            {NIGHT.station.road}
          </text>
          <text x="172" y="57">
            {NIGHT.station.sideStreet}
          </text>
          <text x="252" y="153">
            남부순환로
          </text>
        </g>
        <g fontSize="13" fontWeight="700">
          <rect
            x="8"
            y="71"
            width="108"
            height="26"
            rx="5"
            fill="#fff9ea"
            stroke="#b9b59c"
          />
          <text x="62" y="89" fill="#26392d" textAnchor="middle">
            {NIGHT.station.name}
          </text>
          <circle cx="153" cy="112" r="12" fill="#e8c174" />
          <text x="153" y="117" fill="#18392c" textAnchor="middle">
            {nearby.id}
          </text>
          <text x="172" y="116" fill="#18392c">
            {nearby.mapLabel}
          </text>
          <circle cx="83" cy="207" r="12" fill="#e8c174" />
          <text x="83" y="212" fill="#18392c" textAnchor="middle">
            {overnight.id}
          </text>
          <text x="103" y="212" fill="#18392c">
            {overnight.mapLabel}
          </text>
          <rect x="246" y="39" width="113" height="37" rx="6" fill="#18392c" />
          <text x="302.5" y="62" fill="#fff9ea" textAnchor="middle">
            {NIGHT.venue.name}
          </text>
        </g>
      </svg>
      <figcaption>위치 관계를 간략히 표시한 약도</figcaption>
    </figure>
  );
}

function MapLinks({
  place,
}: {
  place: Pick<typeof NIGHT.venue, 'name' | 'address' | 'maps'>;
}) {
  return (
    <div className={`${styles.links} ${styles.mapLinks}`}>
      <CopyAddressButton name={place.name} address={place.address} />
      {place.maps.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          aria-label={`${label}에서 ${place.name} 열기`}
        >
          {label}
        </a>
      ))}
    </div>
  );
}

export function NightInvitation() {
  return (
    <main className={styles.invitation}>
      <header className={styles.cover}>
        <div className={styles.team}>
          <Image src={NIGHT.emblem} alt="" width={40} height={40} />
          <span>{NIGHT.team}</span>
        </div>
        <h1>{NIGHT.title}</h1>
        <p>{NIGHT.message}</p>
        <div className={styles.coverMedia}>
          <Image src={NIGHT.cover.src} alt={NIGHT.cover.alt} preload />
        </div>
        <time dateTime={NIGHT.dateTime}>
          {NIGHT.date} · {NIGHT.time}
        </time>
        <a className={styles.venueJump} href="#night-directions">
          {NIGHT.venue.name} ↓
        </a>
      </header>

      <section
        className={styles.directions}
        id="night-directions"
        aria-labelledby="night-route-title"
      >
        <h2 id="night-route-title">오시는 길</h2>
        <p className={styles.place}>{NIGHT.venue.name}</p>
        <p>{NIGHT.venue.address}</p>
        <p>{NIGHT.station.name} 인근</p>
        <DirectionsMap />
        <MapLinks place={NIGHT.venue} />
        <small>티맵은 앱이 설치된 기기에서 열립니다.</small>
        <h3>공영주차장</h3>
        <p>{NIGHT.parking.note}</p>
        <ul className={styles.parking}>
          {NIGHT.parking.lots.map(lot => (
            <li key={lot.id}>
              <span className={styles.marker} aria-hidden="true">
                {lot.id}
              </span>
              <div>
                <strong>{lot.name}</strong>
                <p>{lot.address}</p>
                <p>
                  {lot.hours} · {lot.rate}
                </p>
                <MapLinks place={lot} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className={styles.president}>
        <div className={styles.presidentHeading}>
          <p>{NIGHT.president.title}</p>
          <PresidentCharacter />
        </div>
        <ContactButtons phone={NIGHT.president.phone} />
      </footer>
    </main>
  );
}
