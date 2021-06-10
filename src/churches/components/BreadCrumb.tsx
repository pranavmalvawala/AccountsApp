import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";

export interface BreadCrumbProps {
    to: string,
    name: string,
    active?: boolean
}

interface Props {
  items: BreadCrumbProps[];
}

export const BreadCrumb: React.FC<Props> = ({ items }) => (
  <Breadcrumb className="something">
    {items.map((i, index) => (
      <Breadcrumb.Item
        key={index}
        linkAs={Link}
        linkProps={{ to: i.to }}
        active={i.active}
      >
        {i.name}
      </Breadcrumb.Item>
    ))}
  </Breadcrumb>
);
