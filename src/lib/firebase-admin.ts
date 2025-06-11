import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDsZD4aB4QUUdFT\nIqyYGIZmnKJwZFNfUVTm3iaVaaZ7WP6emUmZO1LGIemp7wxEv9cL0Ap2UR9b3a7/\nGTwkcmp5E4mcrBFkeC2xbQEejURV7/IiSNPQC1i6tyFzKMmV8ulz8v40SJyOXc9c\nK3oCXG4VyMyvLw2BE0cODagOgb9qwLdXG06YqwP6UTdZBmBgvybZcC0s9GkIjsvK\nh7cPeRSZzLG9d4KRpHBCJoLBKo5KDd3q0B0JXdKOBGBOtFBThx6wqby9KBB2Qouw\nF8aGFZnMLAqa6pu4pud1vVCsshbrGvPL/r7eS2TNPCIupDRXDN1BmskPQCb1H7y7\nH+07qiT/AgMBAAECggEAAncjLKtSZdHaoIbWjPmIgU515T0un2peO9AqT9mbumKZ\nuTa5DUeQm+9jm/mZw6fKit1/Fm/PJ2qe9hshxPGKibu57i/fOJCGTXjpD5QCl/Da\nMiBXUS6lHMFnMGfG/nDbnXF11D7Dnzp8PKZZbeff4AtJkzQm7GcykQN0cr5IrEjU\nHpJNMdb7eWq8Q7jXReVegpN0u7tpiNJXGIR8VNc6r8SGvyC0DkMJ0qx16nfVnMNt\nmFl+H+/5uFJPgxqnzZIfT+vkrVAtpuK9aOLFZ1rZltzW78v/A1FUtpDegc9Jzry/\n/jFKIDWdVfh21ltn/zVRTnF0D9yCrsHqbWFZMSTFDQKBgQD84aZLW6PgnNabzRLF\nlq8/gTVUZkZHzh0w2Oiag6flUpdmYf88LDIzs4fHEouzaGtSyVCuKvci6IvxT7b3\nZGN52Vug7a7R68RQAnvqjkQAVjKkjm83bJIGWa5G0/FF1o587YkUedea7RIqyFIf\nj0YMXoiyqyoQAVyQ6wFFFpVe1QKBgQDvTojDg2ApZUQLLScbKzPlHjA+ZN64dLtr\nzgJsA6XqLRkC01ee/RnQDCxG2flG5n0kZvFNv3a7hT+QvKH+ZbXCadyV1YU+JHiB\nG9gNXEnZPaHUrM+8Mnvd9vK7sAExs+UlDYvU50PUhKnB6DIcykfXKBOVbiv74n8f\nV5natgsmgwKBgQDT+PYjHursgatnJ+x/UgMOcWlZmO16jSxs4LWBp7BaCvQ77xM6\nxjVCn0/GMCaIOZQU7glCJWPJkDKWEWLmVvEHl4o2CGZNMpr5Ekv63kvkGF0VEQvq\n4og46H2sg0Ywa1w/HgGU91kiVWywDgDA0aE/BxMA6Xc1uV51X3hOCFMnDQKBgQDc\nZzB/IdjHR4VL5eJGm5vIQe2dCbo3mQulVq/UW+fLro2ClLP2spW7j/qXptp3+oD3\nrfhA6z6npynMXG+2pmapEGcheO6nNV/nSYXLiFxbwO/zuNX7N2PuIyucwZXX+R/q\n6HcJN5a5fRX8iabd7VANUdP3pOjNrOX4L+58CX5rkQKBgQDnjry0Sc30zdD1z7OZ\nVDCHQb3vSaYWZSfUbsBQnm+hCV+/R9psITj+0pYdWY2Xwk9UXnWnGGYf3NzGWZIB\nqlDtqv4X06gTlw2+0LUFZhzGjah5aqcm5lJeOS8U3P93Wx4zqjLI9l72SFWGnLjW\nLQcouBKsWBgBg349jXtCQyvkBQ==\n-----END PRIVATE KEY-----\n";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "clean-tracker-c3760",
      clientEmail: "firebase-adminsdk-fbsvc@clean-tracker-c3760.iam.gserviceaccount.com",
      privateKey: privateKey,
    }),
  });
}

export const adminAuth = getAuth();
