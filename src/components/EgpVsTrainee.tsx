import { egpComparison, egpIntro, lateralTraining } from '../content';

export default function EgpVsTrainee() {
  return (
    <section className="section" id="egp">
      <div className="sectionHead">
        <span>YOUR PROGRAM</span>
        <h2>EGP vs. Normal Trainee</h2>
        <p>{egpIntro}</p>
      </div>

      <div className="panel pad">
        <h3 className="egpTitle">
          Normal Trainee vs. EGP Trainee: How They Differ
        </h3>
        <p className="egpLead">
          A quick look at how the experience of a normal trainee and an EGP
          trainee differs:
        </p>

        <div className="tableScroll">
          <table className="egpTable">
            <thead>
              <tr>
                <th scope="col">Aspect</th>
                <th scope="col">Normal Trainee</th>
                <th scope="col" className="egpCol">
                  Esyasoft EGP
                </th>
              </tr>
            </thead>
            <tbody>
              {egpComparison.map((row) => (
                <tr key={row.aspect}>
                  <th scope="row">{row.aspect}</th>
                  <td>{row.normal}</td>
                  <td className="egpCol">{row.egp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lateralBox">
          <h4>{lateralTraining.title}</h4>
          <p>{lateralTraining.text}</p>
        </div>
      </div>
    </section>
  );
}
