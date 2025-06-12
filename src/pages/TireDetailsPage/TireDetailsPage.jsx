import { useParams } from "react-router-dom";
import s from "./TireDetailsPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchTiresById } from "../../redux/tire/operations";
import { selectTireById } from "../../redux/tire/selectors";

export const TireDetailsPage = () => {
  const dispatch = useDispatch();

  const { tireId } = useParams();
  console.log(`Деталі про шину id - ${tireId}.`);

  return <h2>Деталі про шину .</h2>;
};
