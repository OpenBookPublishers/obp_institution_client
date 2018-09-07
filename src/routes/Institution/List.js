import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Input, Card, Button, Table, filterDropdown, Icon, Divider, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './List.less';
import { getContacts } from '../../services/api';

@connect(({ institution, loading }) => ({
  institution,
  loading: loading.models.institution,
}))
export default class SearchList extends Component {
  pageSize = localStorage.getItem('metrics-borker-works-pagesize');
  state = {
    searchName: '',
    filteredInfo: null,
    pagination: {
        position: 'both',
        pageSize: parseInt(this.pageSize) || 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '25', '50','100', '500', '1000', '5000'],
    },
    sortedInfo: {columnKey: "institution_name", field: "institution_name", order:"descend"},
    institution: this.props.institution.institution,
  };

  handleChange = (pagination, filters, sorter) => {
    localStorage.setItem('metrics-borker-works-pagesize', pagination.pageSize);
    this.setState({
      pagination: pagination,
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  handleNameSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchName: selectedKeys[0] });
  }

  handleNameReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchName: '' });
  }

  handleIPRangeSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchIPRange: selectedKeys[0] });
   }

  handleIPRangeReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchIPRange: '' });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'institution/fetch',
    });
  }

  render() {
    const {
      institution: { institution },
      loading,
    } = this.props;

    const onPressDelete  = institution_uuid => () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'institution/deleteInstitutionFromList',
        payload: institution_uuid
      });
    };

    // get unique countries for filtering
    const countries = [];
    const filters = [];
    institution.map(record => {
      if (countries.indexOf(record.country_code) === -1){
        countries.push(record.country_code);
      }
    });
    countries.map(country => filters.push({text:country,value:country}));

    let { sortedInfo, filteredInfo, pageSize, pagination } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const onIPRangeSearch = (value,record) => record.ip_ranges.toString().toLowerCase().includes(value.toLowerCase());
    const iprangeSearch = ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
       <div className={styles.customFilterDropdown}>
          <Input
            ref={ele => this.searchInput = ele}
            placeholder="Search ip range"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={this.handleIPRangeSearch(selectedKeys, confirm)}
          />
          <Button
            type="primary"
            onClick={this.handleIPRangeSearch(selectedKeys, confirm)}
          >
            Search
          </Button>
          <Button onClick={this.handleIPRangeReset(clearFilters)}>Reset</Button>
        </div>
      );
    const onNameSearch = (value, record) => record.institution_name.toLowerCase().includes(value.toLowerCase());
    const nameSearch = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className={styles.customFilterDropdown}>
          <Input
            ref={ele => this.searchInput = ele}
            placeholder="Search institution"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={this.handleNameSearch(selectedKeys, confirm)}
          />
          <Button
            type="primary"
            onClick={this.handleNameSearch(selectedKeys, confirm)}
          >
            Search
          </Button>
          <Button onClick={this.handleNameReset(clearFilters)}>Reset</Button>
        </div>
      );
    const onFilterDropdownVisibleChange = (visible) => {
        if (visible) {
          setTimeout(() => {
            this.searchInput.focus();
          });
        }
    };

    const columns = [{
      title: 'Institution',
      dataIndex: 'institution_name',
      sorter: (a, b) => a.institution_name < b.institution_name,
      sortOrder: sortedInfo.columnKey === 'institution_name' && sortedInfo.order,
      filterDropdown: nameSearch,
      filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
      onFilter: onNameSearch,
      onFilterDropdownVisibleChange: onFilterDropdownVisibleChange,
      render: (text, record) => {
        const { searchName } = this.state;
        const regex = new RegExp(`(${searchName})`, 'ig');
        const k = `${record.institution_uuid}-name`;
        return searchName ? (
            <span>
              {text.split(regex).map((fragment, i) => (
                fragment.toLowerCase() === searchName.toLowerCase()
                ? <span className={styles.highlight}>
                    {fragment}
                  </span>
                : <span>{fragment}</span>
              ))}
            </span>
        ) : text
      },
    }, {
      title: 'Country',
      dataIndex: 'country_code',
      filters: filters,
      filteredValue: filteredInfo.country_code || null,
      onFilter: (value, record) => record.country_code === value,
    },{
      title: 'IP Ranges',
      dataIndex: 'ip_ranges',
      filterDropdown: iprangeSearch,
      filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
      onFilter: onIPRangeSearch,
      onFilterDropdownVisibleChange: onFilterDropdownVisibleChange,
      render: (text, record) => {
        const { searchIPRange } = this.state;
        const regex = new RegExp(`(${searchIPRange})`, 'ig');
        const k = `${record.institution_uuid}-ip`;
        return searchIPRange ?
         text.map((ip_range, key) => (
           <Fragment key={`${k}-${key}-search`}>
            <span>
              {ip_range.split(regex).map((fragment, i) => (
                fragment.toLowerCase() === searchIPRange.toLowerCase()
                ? <span key={`${k}-f-${i}`} className={styles.highlight}>
                    {fragment}
                  </span>
                : <span key={`${k}-f-${i}`}>{fragment}</span>
              ))}
            </span>
            <Divider type="vertical" />
           </Fragment>
         ))
        : (text.map((ip_range, key) =>
            <Fragment key={`${k}-${key}`}>
              <span>{ip_range}</span><Divider type="vertical" />
            </Fragment>
          ));

      },
    },{
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div>
        <span>
          <a href={`/institutions/edit/${record.institution_uuid}`} >Edit</a>
        </span>
        <Divider type="vertical"/>
        <Popconfirm title="Sure to delete?" onConfirm={onPressDelete(record.institution_uuid)}>
                <a href="javascript:;">Delete</a>
        </Popconfirm>
        </div>
      ),
    }];

    const expandedRowRender = record => (
          <div>
            <p><b>UUID:</b> {record.institution_uuid}</p>
            <p><b>Contacts:</b> {record.contacts}</p>
            <p><b>Institution Notes:</b> {record.institution_notes}</p>
          </div>
        )
    const rowKey = record => record.institution_uuid;

    const description = (
      <Fragment>
        <span>You may click </span>  [<Icon type="search" />] (on column headers) to search by institution. You may also click on [<Icon type="filter" />] to filter by country.
      </Fragment>
    );

    return (
    <PageHeaderLayout
      title="Institutions"
      content={description}
    >
      <Fragment>
          <Card
            className={styles.listCard}
            bordered={false}
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <Table
              pagination={pagination}
              loading={loading}
              rowKey={rowKey}
              expandedRowRender={expandedRowRender}
              columns={columns}
              dataSource={institution}
              onChange={this.handleChange}
            />
          </Card>
      </Fragment>
    </PageHeaderLayout>
    );
  }
}
