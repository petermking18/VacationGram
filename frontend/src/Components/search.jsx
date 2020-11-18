import React from "react";
import {Rating} from './Rating';
import { Price } from './Price';
import { TravelGramRepo } from '../Api/TravelGramRepo';
import NavBar from './navBar';
import './search.css';
import { Link } from "react-router-dom";

export class Search extends React.Component{

    travelGramRepo = new TravelGramRepo();

    state = {
        username: "",
        origin: "",
        destination: "",
        price: "",
        reaction: "",
        rating: "",
        results: [],
    }

    search(username, origin, destination, price, reaction, rating)
    {
        username = '"' + username + '"';
        this.travelGramRepo.search(username, origin, destination, price, reaction, rating).then(returnResults => {
            console.log(returnResults);
            this.setState({results: returnResults});
        });
    }

  render() {
    return (
      <>
      <NavBar id={this.props.match.params.id}/>
        <div className = "container">
        <div className="card mt-3 mb-3">
            <div className="card-body">
                <h3 className="card-title">Search TravelGram </h3>
                <h6 className="card-title text-danger">(If not applicable, enter "N/A") </h6>
                <div className="form-group">
                    <label >Username<span className="text-danger">*</span></label>
                        <input type="text"
                            className="form-control"
                            value={ this.state.username }
                            onChange={ e => this.setState( { username: e.target.value } ) } />
                </div>
                <div className="row">
                                <div className="col-5">
                                    <br></br>
                                    <label>Origin<span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state.origin}
                                        onChange={ e => this.setState({ origin: e.target.value })} />
                                </div>
                                <div className="col-5">
                                    <br></br>
                                    <label>Destination<span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state.destination}
                                        onChange={ e => this.setState({ destination: e.target.value })} />
                                </div>
                            </div>
                <div className="form-group">
                <label >Price<span className="text-danger">*</span></label>
                <select 
                        className="form-control"
                        value={ this.state.price }
                        onChange={ e => this.setState( { price: e.target.value } ) }>
                        <option> </option>
                        <option value = '1'>$</option>
                        <option value = '2'>$$</option>
                        <option value = '3'>$$$</option>
                        <option value = '4'>$$$$</option>
                        <option value = '5'>$$$$$</option>
                </select>
                </div>
                <div className="form-group">
                <label>Rating<span className="text-danger">*</span></label>
                <select 
                        className="form-control"
                        value={ this.state.rating }
                        onChange={ e => this.setState( { rating: e.target.value } ) }>
                        <option> </option>
                        <option value = '1'>1 star</option>
                        <option value = '2'>2 stars</option>
                        <option value = '3'>3 stars</option>
                        <option value = '4'>4 stars</option>
                        <option value = '5'>5 stars</option>
                </select>
                </div>
                <div className="form-group">
                <label >Reaction<span className="text-danger">*</span></label>
                <select 
                        className="form-control"
                        value={ this.state.reaction }
                        onChange={ e => this.setState( { reaction: e.target.value } ) }>
                        <option> </option>
                        <option>fun</option>
                        <option>boring</option>
                        <option>exciting</option>
                        <option>scary</option>
                </select>
                </div>
                <div className="mt-2">
                    <button type="button" className="btn btn-primary" onClick={() => this.search(this.state.name, this.state.disease, this.state.symptom, this.state.minPrice, this.state.maxPrice, this.state.sideEffect, this.state.pharmacy)}>
                        Search
                    </button>
                </div>
            </div>
        </div>

        {/* <br></br>
            {this.state.added == true && <h1 className = "text-center text-success">Perscription Sent to the Pharmacy!</h1>}
            {this.state.added == false && <h1 className = "text-center text-danger">Perscription Has Already Been Sent!</h1>}
            <br></br>
            <table className="table table-striped table-condensed">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Symptom</th>
                        <th>Disease</th>
                        <th>Side Effect</th>
                        <th>Pharmacy</th>
                        <th className = "text-right">Price</th>
                        <th className = "text-right">Add Perscription</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.specialist == 0 &&
                        this.state.drugs.map((p, i) =>
                                <tr key = {i}>
                                    <td key = {i}>{ p.name }</td>
                                    <td key = {i}>{ p.SymptomName }</td>
                                    <td key = {i}>{ p.DiseaseName }</td>
                                    <td key = {i}>{ p.SideEffectName }</td>
                                    <td key = {i}>{ p.PharmacyName }</td>
                                    <td key = {i} className = "text-right">{ p.price }</td>
                                    <td key = {i}>
                                        <button className = "btn btn-success float-right" onClick = {() => this.addPrescription(p.drugId, p.name)}>+</button>
                                    </td>
                                </tr>
                        )
                    }
                    {this.state.specialist == 1 &&
                        this.state.drugs.map((p, i) =>
                                <tr key = {i}>
                                    <td key = {i}><Link to = {"../update/" + this.state.id + "/" + p.drugId}>{ p.name }</Link></td>
                                    <td key = {i}>{ p.SymptomName }</td>
                                    <td key = {i}>{ p.DiseaseName }</td>
                                    <td key = {i}>{ p.SideEffectName }</td>
                                    <td key = {i}>{ p.PharmacyName }</td>
                                    <td key = {i} className = "text-right">{ p.price }</td>
                                    <td key = {i}>
                                        <button className = "btn btn-success float-right" onClick = {() => this.addPrescription(p.drugId, p.name)}>+</button>
                                    </td>
                                </tr>
                        )
                    }
                </tbody>
            </table> */}
        </div>
      </>
    );
  }
//   componentDidMount()
//   {
//     this.setState({id: +this.props.match.params.id})
//       let id = +this.props.match.params.id;
//       this.noverdoseRepo.getUserById(id).then(user => {
//         console.log(user.user[0].specialist);
//         this.setState({specialist: user.user[0].specialist})
//   });
//     this.noverdoseRepo.symptoms().then(symptom => {
//           this.setState({symptoms: symptom.data})
//     });
//     this.noverdoseRepo.sideEffects().then(sideEffect => {
//         this.setState({sideEffects: sideEffect.data})
//     });
//     this.noverdoseRepo.diseases().then(disease => {
//         this.setState({diseases: disease.data})
//     });
//     this.noverdoseRepo.pharmacies().then(pharmacy => {
//         this.setState({pharmacies: pharmacy.data})
//     });
//   }
} 

export default Search;